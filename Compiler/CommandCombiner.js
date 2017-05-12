var chalk = require('chalk');
var util = require('util');
var Settings = require("../Configuration/Settings");
var Templates = require("./CommandTemplates");

var fs = require('fs');
var path = require('path');
var ncp = require("copy-paste");

var Paths = require("../Tools/Paths");

var CommandCombiner = (function () 
{
	function CommandCombiner(commandModule) 
	{
		this.module = commandModule;

		// Take all in commandModule.Commands and put into commandblock minecarts to be executed
		// when summoned as passengers on an activator rail

		var minecarts = []
		for(i=0; i < this.module.Commands.length; i++)
		{
			var command = this.module.Commands[i];
			var minecart = util.format(Templates.Current.COMMAND_BLOCK_MINECART_NBT_FORMAT, JSON.stringify(command)); 
			minecarts.push(minecart);
		}
		
		var minecartsString = minecarts.join(",");

		var compiledCommands = util.format(Templates.Current.SUMMON_FALLING_RAIL_FORMAT, minecartsString);

		this.CompiledCommand = compiledCommands;
	}

	CommandCombiner.prototype.createOutput = function(isLast)
	{
		if(Settings.Current.Output.WriteCompiledCommandsToFile)
		{
			var outputFileName = path.resolve(Paths.LocalDirectory + "/" + this.module.SourceName.replace(".mcc", ".oc"));
			fs.writeFileSync(outputFileName, this.module.CompiledCommand);
			console.log(chalk.green("\n * The compiled command has been saved to " + outputFileName));
		}

		if(Settings.Current.Output.ShowCompiledCommands)
		{
			console.log(chalk.green("\n\ * COMPILED-COMMAND:\n"));
			console.log(this.module.CompiledCommand);
		}

		if(Settings.Current.Output.CopyCompiledCommands)
		{
			// Copy to the clipboard
			ncp.copy(this.module.CompiledCommand);
			console.log(chalk.green("\n * The compiled command has been copied into your clipboard."));

			// Give the user time to use the clipboard before moving on.
			if(!isLast) readlineSync.keyIn(chalk.green("   Install into your world before you continue. Type 'c' to continue. "), {limit: 'c'});
		}
	}

	return CommandCombiner;
})();

module.exports = CommandCombiner;