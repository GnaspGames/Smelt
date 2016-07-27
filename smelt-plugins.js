#!/usr/bin/env node

var util = require('util');
var commander = require('commander');
var chalk = require('chalk');
var Program = require("./Program");
var Settings = require("./Settings");
var pjson = require('./package.json');
var BangCommandHelper = require("./BangCommandHelper");

commander
  .description(chalk.yellow("Manage plugins."))
  .usage("[options]")
  .option('--list', 
          'List all available plugins.');
  
process.argv[1] = 'smelt plugins';
commander.parse(process.argv);  

Settings.ReadConfigs();

var doSomething = false;

if(commander.list)
{
    doSomething = true;
    var plugins = BangCommandHelper.GetAllPlugins();

    if(plugins.length > 0)
    {
        console.log(chalk.yellow("\nThe following plugins were found:"));
        plugins.forEach(function(plugin)
        {
            console.log("\n * " + plugin);
        });
    }
    else
    {
        console.log(chalk.yellow("\nNo plugins were found."));
    }
}

if(!doSomething)
{
    commander.outputHelp();
}

require("./VersionCheck").Query();


