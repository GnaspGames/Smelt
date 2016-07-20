#!/usr/bin/env node

var util = require('util');
var fs = require('fs');
var commander = require('commander');
var chalk = require('chalk');
var Program = require("./Program");
var Settings = require("./Settings");
var pjson = require('./package.json');
var readlineSync = require('readline-sync');

commander
  .description(chalk.yellow("Create/modify user and project level configurations."))
  .usage("[options]")
  .option('-s, --show', 
          'Show what settings are currently being used.')
  .option('-l, --change-local', 
          'Change (or create) the ' + chalk.bold('local') + ' config file to customise behaviour ' + chalk.bold('in this project') + '.')
  .option('-g, --change-global', 
          'Change (or create) the ' + chalk.bold('global') + ' config file to customise behaviour ' + chalk.bold('for all projects') + '.');
  
process.argv[1] = 'smelt config';
commander.parse(process.argv);  

Settings.ReadConfigs();

var doSomething = false;

if(commander.show)
{
    doSomething = true;
    console.log(chalk.bold("\n* Current settings:"))
    
    if(Settings.GlobalExists) 
        console.log(chalk.bold("  - including 'global' config"));
    else
        console.log(chalk.bold("  - no 'global' config exists"));
    
    if(Settings.LocalExists) 
        console.log(chalk.bold("  - including 'local' config"));
    else 
        console.log(chalk.bold("  - no 'local' config exists"));

	console.log("\n" + JSON.stringify(Settings.Current, null, 4));
}

if(commander.changeLocal || commander.changeGlobal)
{
    doSomething = true;
    var current, base, savePath = null;

    // Determind vars for local/global
    if(commander.changeLocal)
    {
        base = Settings.GetConfig({includeGlobal:true, includeLocal:false});
        current = Settings.GetConfig({includeGlobal:true, includeLocal:true});
        savePath = Settings.LocalPath;
    }
    else if(commander.changeGlobal)
    {
        base = Settings.GetConfig({includeGlobal:false, includeLocal:false});
        current = Settings.GetConfig({includeGlobal:true, includeLocal:false});
        savePath = Settings.GlobalPath;
    }

    // Go through template and look up values to overwrite
    var newSettings = new Object();
    for(var section in current)
    {
        console.log(chalk.bold("\n  " + section + ": "));
        newSettings[section] = new Object();

        var baseKeys = base[section];
        var currentKeys = current[section];
        for(var key in currentKeys)
        {
            var baseValue = baseKeys[key];
            var currentValue = currentKeys[key];
            var newValue = currentValue;
            
            // Show current value for key and ask if it should be changed
            console.log("\n    " + chalk.italic(key) + " = " + currentValue.toString());    
            var changeIt = readlineSync.keyInYN("    Do you want to change this? ");

            if(changeIt)
            {
                if(typeof currentValue == "boolean")
                {
                    var setTo = readlineSync.keyInYN("    Set to true?");
                    newValue = setTo == true ? true : false;
                }
                else
                {
                    newValue = readlineSync.question("    What should the new value be? ").toString();
                }
                console.log("        VALUE:" + newValue.toString());
            }
            if(baseValue != newValue)
            {
                newSettings[section][key] = new Object();
                newSettings[section][key] = newValue; 
            }
        }
    }

    var saveContent = JSON.stringify(newSettings, null, 4);

    // Show details on file to be created
    console.log(chalk.bold("\n\n* The new configuration:"))
    console.log("\n  Path: " + savePath);
	console.log("\n" + saveContent);

    var createNewConfig = readlineSync.keyInYN("\n  Please confirm, should this be created?");
    if(createNewConfig)
    {
        console.log(chalk.bold("\n New configuration saved to:"));
        console.log(chalk.bold("  " + savePath));
        fs.writeFileSync(savePath, saveContent);
    }
    else
    {
        console.log(chalk.yellow("  Save cancelled!"));
    }
}

if(!doSomething)
{
    commander.outputHelp();
}
