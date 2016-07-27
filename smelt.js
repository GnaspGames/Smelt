#!/usr/bin/env node

var util = require('util');
var commander = require('commander');
var chalk = require('chalk');
var Program = require("./Program");
var Settings = require("./Settings");
var pjson = require('./package.json');

commander
  .version(pjson.version)
  .description(chalk.yellow("A CLI tool used to compile Minecraft commands into one-command installers, for map makers."))
  .usage("<command> [options]")
  .command('compile <path> [options]', 'Compile .mcc modules: <path> should be the path to an .mcc file or directory containing .mcc files')
  .command('config [options]','Create/modify user and project level configurations.')
  .command('plugins [options]', 'Install/manage plugins.');

commander.parse(process.argv);