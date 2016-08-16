var util = require('util');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var ncp = require("copy-paste");
var CommandCreator = require("./CommandCreator");
var CommandModule = require("./CommandModule");
var BangCommandHelper = require("./BangCommandHelper");
var Program = require("./Program");
var Settings = require("./Settings");
var readlineSync = require('readline-sync');


var FileParser = (function () 
{
	function FileParser() 
	{
		this.Commands = [];
		this.BangSetups = [];
		this.PreviousTrigger ="";
		this.PreviousCommand = "";
		this.Module = null;
		this.CustomVariables = {};
	}

	FileParser.prototype.ProcessFile = function (filePath)
	{
		var data = fs.readFileSync(filePath).toString().trim();
		
		console.log(chalk.yellow(util.format("\nProcessing %s", filePath)));
		
		this.Module = this.ProcessData(data, path.basename(filePath));
		
		if(this.BangSetups.length)
		{
			var self = this;
			this.BangSetups.forEach(function(setup)
			{
				console.log(chalk.yellow(util.format("\nTo use the \"!%s\" command you will need to also install the following module into your map: %s", setup.bangName, setup.fileName)));
				var compiledSetupModule = self.ProcessData(setup.setupData, setup.fileName);
				self.OutputCompiledModule(compiledSetupModule, false);
				BangCommandHelper.AddSupportModuleToCache(setup);
			});
		}

		console.log(chalk.yellow(util.format("\nProcessing of %s is complete.", this.Module.SourceName)));
		this.OutputCompiledModule(this.Module, true);
	};

	FileParser.prototype.OutputCompiledModule = function(commandModule, isLast)
	{
		if(Settings.Current.Output.WriteCompiledCommandsToFile)
		{
			var outputFileName = path.resolve(Program.LocalDirectory + "/" + commandModule.SourceName.replace(".mcc", ".oc"));
			fs.writeFileSync(outputFileName, commandModule.CompiledCommand);
			console.log(chalk.green("\n * The compiled command has been saved to " + outputFileName));
		}

		if(Settings.Current.Output.ShowCompiledCommands)
		{
			console.log(chalk.green("\n\ * COMPILED-COMMAND:\n"));
			console.log(commandModule.CompiledCommand);
		}

		if(Settings.Current.Output.CopyCompiledCommands)
		{
			// Copy to the clipboard
			ncp.copy(commandModule.CompiledCommand);
			console.log(chalk.green("\n * The compiled command has been copied into your clipboard."));

			// Give the user time to use the clipboard before moving on.
			if(!isLast) readlineSync.keyIn(chalk.green("   Install into your world before you continue. Type 'c' to continue. "), {limit: 'c'});
		}
	};
	
	FileParser.prototype.ProcessData = function (data, sourceName)
	{
		CommandCreator.startNewFile();
		
		this.Commands = [];
	
		var content = this.removeComments(data.toString().trim());
		var lines = content.split("\n");
		var distanceOffset = 3;
		
		var type = "impulse";
		var conditional = false;
		var auto = true;
		
		var commands = [];

		var summonFilenameMarker = CommandCreator.addNewFileMarker(path.basename(sourceName));

		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n\n* START NEW FILE!"))
			console.log("  " + sourceName);
			if(summonFilenameMarker) console.log("   -> " + summonFilenameMarker);
			else console.log("   -> " + "No file marker summoned");
		}
		var self = this;
		var process = function(line, endoffile)
		{
			try
			{
				self.processLine(line, endoffile);
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
		
		var gamerule = "gamerule commandBlockOutput false";
		var summonRebuildEntity = "summon ArmorStand ~ ~-1 ~ {Tags:[\"oc_rebuild\",\"oc_marker\"]}"
		var clearArea = "/execute @e[tag=oc_rebuild] ~ ~ ~ fill ~1 ~ ~1 ~14 ~10 ~14 air 0";
		var clearlineMarkers = "/execute @e[tag=oc_rebuild] ~ ~ ~ kill @e[tag=oc_marker,dx=15,dy=20,dz=15]";
		var clearlineMarkers_old = "kill @e[tag=lineMarker,dx=15,dy=20,dz=15]"; // keep for backwards compatibility
		this.Commands.unshift(gamerule, summonRebuildEntity, clearArea, clearlineMarkers, clearlineMarkers_old, summonFilenameMarker);
		
		var removeBlocks = CommandCreator.buildSetblockCommand(0, 1, 0, "up", "impulse", false, true, "", "/fill ~ ~-1 ~ ~ ~ ~ air");
		
		var removeMinecarts = "kill @e[type=MinecartCommandBlock,r=0]";
		this.Commands.push(removeBlocks, removeMinecarts);
		
		//if(Settings.Current.Output.ShowDebugInfo) console.log("\n\nCREATE IN THIS ORDER:\n");
		var minecarts = []
		for(i=0; i < this.Commands.length; i++)
		{
			var command = this.Commands[i];
			var minecart = util.format("{id:MinecartCommandBlock,Command:%s}", JSON.stringify(command)); 
			minecarts.push(minecart);
			//if(Settings.Current.Output.ShowDebugInfo) console.log(minecart);
		}
		
		var minecartsString = minecarts.join(",");

		var compiledCommand = "summon FallingSand ~ ~1 ~ {Block:activator_rail,Time:1,Passengers:[%s]}"
		compiledCommand = util.format(compiledCommand, minecartsString);

		var commandModule = new CommandModule();
		commandModule.SourceName = sourceName;
		commandModule.CompiledCommand = compiledCommand;

		return commandModule;
	};

	FileParser.prototype.removeComments = function(content)
	{
		var blockComments = String.raw`\/\*(.|[\r\n])*?\*\/`;
		var lineComments = String.raw`\/\/(.*?)\r?\n`;
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
		
    FileParser.prototype.processLine = function (line , endoffile)
	{
		if(line[0] == "#" || line[0] == ">" || line[0] == "/" || line[0] == "!" || line[0] == "$" || endoffile == true) 
		{
			// If a new trigger is found, or this is the endoffile, process the previous line
			switch (this.PreviousTrigger)
			{
				case "#":
					this.processRowLine(this.PreviousCommand.trim());
					break;
				case ">":
					this.processJsonLine(this.PreviousCommand.trim());
					break;
				case "/":
					this.processCommandBlockLine(this.PreviousCommand.trim());
					break;
				case "!":
					this.processBangLine(this.PreviousCommand.trim());
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
	
	FileParser.prototype.processRowLine = function(line)
	{
		line=this.checkForVariables(line);
		var summon = CommandCreator.startNewLine(line);
		if(summon) this.Commands.unshift(summon);
		
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
		CommandCreator.processJSONLine(json);
		
		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n* PROCESS JSON OPTIONS"));
			console.log("  " + JSON.stringify(json));
			console.log("   -> type = " + CommandCreator.type);
			console.log("   -> conditional = " + CommandCreator.conditional);
			console.log("   -> auto = " + CommandCreator.auto);
			console.log("   -> executeAs = " + CommandCreator.executeAs);
			console.log("   -> markerTag = " + CommandCreator.markerTag);
		}
	};
	
	FileParser.prototype.processCommandBlockLine = function(line)
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
				this.Commands.unshift(cornerCmd);
				if(Settings.Current.Output.ShowDebugInfo)
					console.log("   -> " + cornerCmd);
			}
		}

		var summon = CommandCreator.addNewCmdMarker();
		if(summon) this.Commands.unshift(summon);
		
		var command = CommandCreator.addSetblockCommand(line);
		this.Commands.unshift(command);
		
		if(Settings.Current.Output.ShowDebugInfo)
		{
				console.log(chalk.bold("\n* CREATE COMMAND BLOCK"));
				console.log("  " + line);
				console.log("   -> " + command);
				if(summon) console.log("   -> " + summon);
		}
	};
	
	FileParser.prototype.processBangLine = function(line)
	{
		line=this.checkForVariables(line);
		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n* PROCESS BANG COMMAND"));
			console.log("  " + line);
		}
		var commands = BangCommandHelper.ProcessBang(line, this);
		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log("  Commands generated:");
		}
		if(commands.length > 0)
		{
			var self = this;
			commands.forEach(function(command)
			{
				if(Settings.Current.Output.ShowDebugInfo) console.log("   -> " + command);
				self.Commands.unshift(command);
			});
		}
	};

	FileParser.prototype.processVariableLine = function(line)
	{
		// varName; everything up to the first =
		var varName = line.substr(0,line.indexOf('=')).trim();
		// varValue; averything after the first =
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
			var varNameUsed = "(\\${" + name + "})|(\\$" + name + "\\b)";

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
			this.BangSetups.forEach(function(existingSetup)
			{
				if(bangSetup.setupData == existingSetup.setupData)
					exists = true;
			});
		}

		if(!exists)
			this.BangSetups.push(bangSetup);
	}
	
	return FileParser;
	
})();

module.exports = FileParser;
