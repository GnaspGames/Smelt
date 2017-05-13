var util = require('util');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var ncp = require("copy-paste");

var Templates = require("./CommandTemplates");
var readlineSync = require('readline-sync');

var Paths = require("../Tools/Paths");


var FileParser = (function () 
{
	function FileParser() 
	{
		this.BangSetupModules = [];
		this.PreviousTrigger ="";
		this.PreviousCommand = "";
		this.CustomVariables = {};
	}

	FileParser.prototype.ProcessFile = function (filePath)
	{
		var data = fs.readFileSync(filePath).toString().trim();
		
		console.log(chalk.yellow(util.format("\nProcessing %s", filePath)));

		var commandModule = this.ProcessData(data, path.basename(filePath));
		
		if(this.BangSetupModules.length)
		{
			var self = this;
			this.BangSetupModules.forEach(function(setup)
			{
				console.log(chalk.yellow(util.format("\nTo use the \"!%s\" command you will need to also install the following module into your map: %s", setup.bangName, setup.fileName)));
				var supportModule = self.ProcessData(setup.setupData, setup.fileName);
				self.PrintCompiledModuleSize(commandModule);
				self.OutputCompiledModule(supportModule, false);
				BangCommandHelper.AddSupportModuleToCache(setup);
			});
		}

		console.log(chalk.yellow(util.format("\nProcessing of %s is complete.", commandModule.SourceName)));
		this.PrintCompiledModuleSize(commandModule);
		this.OutputCompiledModule(commandModule, true);
	};

	FileParser.prototype.PrintCompiledModuleSize = function(commandModule)
	{
		var length = commandModule.CompiledCommand.length;
		var percentage = Math.round(((length / 32500) * 10000), 2) / 100;
		console.log(chalk.yellow(util.format("Command length: %s (%s%)", length.toLocaleString(), percentage)));
	}

	FileParser.prototype.OutputCompiledModule = function(commandModule, isLast)
	{	
		if(Settings.Current.Output.UseRCON)
		{
			var rconClient = new RconClient(commandModule);
			rconClient.sendModule();
		}
		else
		{
			var combiner = new CommandCombiner(commandModule);
			combiner.createOutput(isLast);
		}
	};
	
	FileParser.prototype.ProcessData = function (data, sourceName)
	{
		// Create a new module instance
		var commandModule = new CommandModule();
		commandModule.SourceName = sourceName;

		commandModule.setCoordinates(
			Settings.Current.Modules.StartX,
			Settings.Current.Modules.StartY,
			Settings.Current.Modules.StartZ,
			Settings.Current.Modules.StopX,
			Settings.Current.Modules.StopY,
			Settings.Current.Modules.StopZ,
			Settings.Current.Modules.Border
		);

		// Pass module to CommandCreator to start new variables
		CommandCreator.reset(commandModule);

		var content = this.removeComments(data.toString().trim());
		var lines = content.split("\n");
		var distanceOffset = 3;
		
		var type = "impulse";
		var conditional = false;
		var auto = true;
		
		var commands = [];

		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n\n* START NEW FILE!"))
			console.log("  " + sourceName);
		}
		
		var self = this;
		var process = function(line, endOfFile)
		{
			try
			{
				self.processLine(commandModule, line, endOfFile);
			}
			catch(err)
			{
				console.log(chalk.red.bold("\n\n  LINE ERROR!"));
				console.log(util.format(chalk.red.bold("  Error on %s:%d - %s\n\n"), sourceName, i, err));
				throw err;
			}
		}

		// Loop through each line in the file.
		for(i=0; i < lines.length; i++)
		{
			var line = lines[i].trim();
			process(line, false);
		}
		
		// One final call to processLine to complete the last trigger
		process("", true);

		
		
		// var summonRebuildEntityCommand = util.format(
		// 		Templates.Current.SUMMON_REBUILD_ENTITY,
		// 		commandModule.lowX,
		// 		(commandModule.lowY - 1), // lower y by 1 because minecarts execute 1 block up
		// 		commandModule.lowZ
		// 	);

		// var clearAreaCommand = util.format(
		// 		Templates.Current.CLEAR_AREA_FORMAT, 
		// 		commandModule.border,
		// 		commandModule.lowY,
		// 		commandModule.border,
		// 		(commandModule.diffX - commandModule.border),
		// 		commandModule.diffY,
		// 		(commandModule.diffZ - commandModule.border)
		// 	);

		// var clearMarkersCommand = util.format(
		// 		Templates.Current.CLEAR_MARKERS_FORMAT,
		// 		commandModule.diffX,
		// 		commandModule.diffY,
		// 		commandModule.diffZ
		// 	);

		// // Add commands to start of combined command
		// commandModule.Commands.unshift(
		// 	Templates.Current.CLEAR_MODULE_DISPLAY_MARKER,
		// 	summonRebuildEntityCommand, 
		// 	clearAreaCommand, 
		// 	clearMarkersCommand,
		// 	summonModuleDisplayMarker
		// );

			
		// var removeBlocksNextTickCommand = CommandCreator.buildSetblockCommand(0, 2, 0, "up", "impulse", false, true, false, "", "/fill ~ ~-1 ~ ~ ~ ~ air");
		
		// // Add commands to end of combined command
		// if(Settings.Current.Output.UseRCON)
		// {
		// 	commandModule.Commands.push(
		// 		Templates.Current.CLEAR_REBUILD_ENTITY
		// 	);
		// }
		// else
		// {
		// 	commandModule.Commands.push(
		// 		removeBlocksNextTickCommand, 
		// 		Templates.Current.CLEAR_REBUILD_ENTITY,
		// 		Templates.Current.CLEAR_MINECARTS
		// 	);
		// }

		return commandModule;
	};

	FileParser.prototype.removeComments = function(content)
	{
		var blockComments = String.raw`\/\*(.|[\r\n])*?\*\/`;
		var lineComments = String.raw`\/\/(.*?)\r?($|\n)`;
		var strings = String.raw`"((\\[^\n]|[^"\n])*)"`;

		var expression = new RegExp(blockComments + "|" + lineComments + "|" + strings, 'g');

		content = content.replace(expression, function(match, offset, str)
		{
			if(match.startsWith("//"))
			{
				// It's a line comment, replace with new line.
				return "\n"
			}
			else if(match.startsWith("/*"))
			{
				// It's a block comment, remove it all.
				return '';
			}
			else if(match[0] == `"`)
			{
				// It a string; keep it.
				return match;
			}
			else
			{
				// It's none of the above. Keep just in case.
				return match;
			}
		});

		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n\n* REMOVING COMMENTS!"))
			console.log(chalk.bold("\n\n  RESULT:"))
			console.log(content);
		}

		return content.trim();
	}
		
	FileParser.prototype.processLine = function (commandModule, line , endOfFile)
	{
		if(line[0] == "#" || line[0] == ">" || line[0] == "/" || line[0] == "!" || line[0] == "$" || endOfFile == true) 
		{
			// If a new trigger is found, or this is the endOfFile, process the previous line
			switch (this.PreviousTrigger)
			{
				case "#":
					this.processRowLine(commandModule, this.PreviousCommand.trim());
					break;
				case ">":
					this.processJsonLine(this.PreviousCommand.trim());
					break;
				case "/":
					this.processCommandBlockLine(commandModule, this.PreviousCommand.trim());
					break;
				case "!":
					this.processBangLine(commandModule, this.PreviousCommand.trim());
					break;
				case "$":
					this.processVariableLine(this.PreviousCommand.trim());
					break;
			}
			this.PreviousTrigger = line[0];
			this.PreviousCommand = "";
		}

		this.PreviousCommand += " " + line;
	};
	
	FileParser.prototype.processRowLine = function(commandModule, line)
	{
		line=this.checkForVariables(line);
		var summon = CommandCreator.startNewRow(line);
		if(summon) commandModule.addCommand(summon);
		
		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n\n* START NEW LINE!"))
			console.log("  " + line);
			if(summon) console.log("   -> " + summon);
			else console.log("   -> " + "No line marker summoned");
		}
	};
	
	FileParser.prototype.processJsonLine = function(line)
	{
		line=this.checkForVariables(line);

		var json = JSON.parse(line.replace(">",""));
		

		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n* PROCESS JSON OPTIONS"));
			console.log("  " + JSON.stringify(json));
			console.log("   -> type = " + CommandCreator.currentCommandBlock.type);
			console.log("   -> conditional = " + CommandCreator.currentCommandBlock.conditional);
			console.log("   -> auto = " + CommandCreator.currentCommandBlock.auto);
			console.log("   -> trackOutput = " + CommandCreator.currentCommandBlock.trackOutput);
			console.log("   -> executeAs = " + CommandCreator.executeAs);
			console.log("   -> markerTag = " + CommandCreator.markerTag);
		}

		CommandCreator.processJSONLine(json);
	};
	
	FileParser.prototype.processCommandBlockLine = function(commandModule, line)
	{
		// Replace TABS
		line=line.replace(/\t/g,' ');
		// Remove starting /
		line=line.substr(1);
		// Replace variables
		line=this.checkForVariables(line);

		var cornerCommands = CommandCreator.fixConditionalCorners();
		if(cornerCommands.length > 0)
		{
			if(Settings.Current.Output.ShowDebugInfo)
				console.log(chalk.bold("\n* CONDITIONAL CORNER FIX:"));
			for(var i in cornerCommands)
			{	
				var cornerCmd = cornerCommands[i];
				commandModule.addCommand(cornerCmd);
				if(Settings.Current.Output.ShowDebugInfo)
					console.log("   -> " + cornerCmd);
			}
		}

		var summon = CommandCreator.addNewCmdMarker();
		if(summon) commandModule.addCommand(summon);
		
		var command = CommandCreator.addSetblockCommand(line);
		commandModule.addCommand(command);
		
		if(Settings.Current.Output.ShowDebugInfo)
		{
				console.log(chalk.bold("\n* CREATE COMMAND BLOCK"));
				console.log("  " + line);
				console.log("   -> " + command);
				if(summon) console.log("   -> " + summon);
		}
	};
	
	FileParser.prototype.processBangLine = function(commandModule, line)
	{
		line=this.checkForVariables(line);
		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n* PROCESS BANG COMMAND"));
			console.log("  " + line);
		}
		var commands = BangCommandHelper.ProcessBang(commandModule, line, this);
		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log("  Commands generated:");
		}
		if(commands.length > 0)
		{
			commands.forEach(function(command)
			{
				if(Settings.Current.Output.ShowDebugInfo) console.log("   -> " + command);
				commandModule.addCommand(command);
			});
		}
	};

	FileParser.prototype.processVariableLine = function(line)
	{
		// varName; everything up to the first =
		var varName = line.substr(0,line.indexOf('=')).trim();
		// varValue; everything after the first =
		var varValue = line.substr(line.indexOf('=')+1).trim();
		varValue = this.checkForVariables(varValue);

		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n* VARIABLE ASSIGNED!"));
			console.log("  '" + varName + "' = '" + varValue + "'");
		}
		
		this.setVariable(varName, varValue);
	};

	FileParser.prototype.setVariable = function(varName, varValue)
	{
		this.CustomVariables[varName] = varValue;
	};

	FileParser.prototype.checkForVariables = function(line)
	{
		// Loop through the keys
		for(var varName in this.CustomVariables)
		{
			var name = varName.substr(1);
			var varNameUsed = "(\\$\\{" + name + "})|(\\$" + name + "\\b)";
			
			line = line.replace(new RegExp(varNameUsed, 'g'), this.CustomVariables[varName]);
		}
		return line;
	};

	FileParser.prototype.getVariable = function(varName)
	{
		return this.CustomVariables[varName];
	}

	FileParser.prototype.AddBangSetup = function(bangSetup)
	{
		var exists = false;

		if(BangCommandHelper.IsSupportModuleInCache(bangSetup))
			exists = true;
		else
		{
			this.BangSetupModules.forEach(function(existingSetup)
			{
				if(bangSetup.setupData == existingSetup.setupData)
					exists = true;
			});
		}

		if(!exists)
			this.BangSetupModules.push(bangSetup);
	}
	
	return FileParser;
	
})();

module.exports = FileParser;
