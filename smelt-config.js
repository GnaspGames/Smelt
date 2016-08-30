#!/usr/bin/env node

var util = require('util');
var fs = require('fs');
var path = require('path');
var commander = require('commander');
var chalk = require('chalk');
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

    var allDescriptions = Settings.GetDescriptions();
    var allValidValues = Settings.GetValidValues();

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

    console.log(chalk.yellow("Leave value blank to accept existing value, or type a new value to change."));

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
            // Get list of valid values
            var validValues = allValidValues[section][key]; 
            // If list doesn't exist, this isn't a valid setting (maybe redundant setting from old config).
            var isValidSetting = validValues != null;

            if(isValidSetting)
            {
                var description = allDescriptions[section][key].toString();
                var baseValue = baseKeys[key];
                var currentValue = currentKeys[key];
                var newValue = currentValue;
                
                // Show current value for key and ask if it should be changed
                console.log("\n    " + chalk.bold(key));    
                console.log("    " + description);
                var stepComplete = false;

                while (!stepComplete) 
                {
                    var inputValue = readlineSync.question("    [" + currentValue.toString() + "] ");
                    var changedValue = (inputValue != "");
                    if(changedValue)
                    {
                        // Convert valud depending on allowed values
                        inputValue = Settings.ConvertInputValue(section, key, inputValue)
                        // Check valid values
                        if(Settings.CheckValueIsValid(section, key, inputValue))
                        {
                            // If the inputValue matches one of the valid values, great! 
                            newValue = inputValue;
                            stepComplete = true;
                        }
                        else
                        {
                            // Otherwise, ask them to try again.
                            if(Array.isArray(validValues))
                                console.log(chalk.yellow("    Sorry, valid values are: " + validValues.join(", ")));
                            else
                                console.log(chalk.yellow("    Sorry, value must be: " + validValues));

                            console.log("    Please try again.");
                        }
                    }
                    else
                    {
                        stepComplete = true;
                    }
                }
                
                if(baseValue != newValue)
                {
                    newSettings[section][key] = new Object();
                    newSettings[section][key] = newValue; 
                }
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
        // Create the directory if it doesn't exist
        var saveDir = path.dirname(savePath);
        if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);
        // Save the file.
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

require("./VersionCheck").Query();