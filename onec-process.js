#!/usr/bin/env node

var util = require('util');
FileParser = require("./FileParser");
CommandModule = require("./CommandModule");
var commander = require('commander');
var chalk = require('chalk');
var Program = require("./Program");
var Settings = require("./Settings");
var pjson = require('./package.json');

commander
  .version(pjson.version)
  .description(chalk.yellow("<path> should be the path to a .mcc file or directory containing .mcc files."))
  .usage("<path> [options]")
  .arguments("<path>")
  .action(function(path)
  {
	  Program.PathArg = path
  })
  .option('-s, --show', 
          'Show any combined commands in the console.')
  .option('-d, --debug', 
          'Show additional debug information in the console.')
  .option('-c, --copy', 
          'Copy combined commands to system clipboard, one at a time. This prevents the writing of .oc files unless --write is also included.')
  .option('-w, --write', 
          'Write combined commands to .oc files.');
  
process.argv[1] = 'onec process';
commander.parse(process.argv);  

Settings.ReadConfigs();

if(commander.show)
  Settings.Current.Output.ShowCompiledCommands = true;

if(commander.debug)
  Settings.Current.Output.ShowDebugInfo = true;

if(commander.copy)
{
  Settings.Current.Output.CopyCompiledCommands = true;
  Settings.Current.Output.WriteCompiledCommandsToFile = false;
}

if(commander.write)
  Settings.Current.Output.WriteCompiledCommandsToFile = true;

Settings.OutputDebugInfo();

if(Program.PathArg)
{
	Program.ProcessPath();
}

if(!Program.PathFound)
{
	commander.outputHelp();
	console.log(chalk.red.bold("  Please enter the path to a .mcc file or directory containing .mcc files as the first argument."));
}
