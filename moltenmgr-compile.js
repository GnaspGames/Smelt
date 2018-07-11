#!/usr/bin/env node

StartCompiler = require("./Compiler/StartCompiler");
FileParser = require("./Compiler/FileParser");
CommandBlock = require("./Compiler/CommandBlock");
CommandModule = require("./Compiler/CommandModule");
CommandCreator = require("./Compiler/CommandCreator");
BangCommandHelper = require("./BangCommands/Helper");
RconClient = require("./Compiler/RconClient");
Settings = require("./Configuration/Settings");

var util = require('util');
var commander = require('commander');
var chalk = require('chalk');
var Paths = require("./Tools/Paths");
var pjson = require('./package.json');

commander
	.version(pjson.version)
	.description(chalk.yellow("Compile .mcc modules: <path> should be the path to an .mcc file or directory containing .mcc files."))
	.usage("<path> [options]")
	.arguments("<path>")
	.action(function (path)
	{
		StartCompiler.PathArg = path
	})
	.option('-s, --show', 'Show any combined-commands in the console.')
	.option('-d, --debug', 'Show additional debug information in the console.')
	.option('-c, --copy', 'Copy combined-commands to system clipboard, one at a time. This disables the writing of .oc files unless --write is also specified.')
	.option('-w, --write', 'Write combined-commands to .oc files.')
	.option('-a, --watch', 'Watch the file/directory and compile each time something changes.');

process.argv[1] = 'molten';
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

if(commander.watch)
	StartCompiler.Watch = true;

Settings.OutputDebugInfo();

if(StartCompiler.PathArg)
{
	StartCompiler.ProcessPath();
}

if(!StartCompiler.PathFound)
{
	console.log(chalk.red.bold("\n  [WARNING] Please enter the path to a .mcc file or directory containing .mcc files as the first argument."));
	commander.outputHelp();
}

require("./Tools/VersionCheck").Query();
