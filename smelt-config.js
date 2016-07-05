#!/usr/bin/env node

var util = require('util');
var commander = require('commander');
var chalk = require('chalk');
var Program = require("./Program");
var Settings = require("./Settings");
var pjson = require('./package.json');

commander
  .description(chalk.yellow("Create/modify user and project level configurations."))
  .usage("[options]")
  .option('--show-current', 
          'Show what settings are currently being used.');
  
process.argv[1] = 'smelt config';
commander.parse(process.argv);  

Settings.ReadConfigs();

var doSomething = false;

if(commander.showCurrent)
{
    doSomething = true;
    console.log(chalk.bold("\n\n* Using settings:"))
	console.log("\n" + JSON.stringify(Settings.Current, null, 4));
}

if(!doSomething)
{
    commander.outputHelp();
}
