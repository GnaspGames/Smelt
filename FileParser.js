var util = require('util');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var ncp = require("copy-paste");
var CommandCreator = require("./CommandCreator");
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
		this.PreviousLine = "";
		this.FinalCommand = "";
		this.Module = null;
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
			if(!isLast) readlineSync.keyIn(chalk.green("   You'll probably want to paste it before moving on. Type 'c' to continue. "), {limit: 'c'});
		}
	};
	
	FileParser.prototype.ProcessData = function (data, sourceName)
	{
		CommandCreator.startNewFile();
		
		this.Commands = [];
	
		var content = data.toString().trim();
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

		for(i=0; i < lines.length; i++)
		{
			var line = lines[i].trim();
			try
			{
				this.processLine(line);
			}
			catch(err)
			{
				console.log(chalk.red.bold("\n\n  LINE ERROR!"));
				console.log(util.format(chalk.red.bold("  Error on %s:%d - %s\n\n"), sourceName, i, err));
				throw err;
			}
		}
		
		var gamerule = "gamerule commandBlockOutput false";
		var clearArea = "fill ~1 ~-1 ~1 ~14 ~10 ~14 air 0";
		var summonMarker = "summon ArmorStand ~ ~-1 ~ {Tags:[\"oc_rebuild\",\"oc_marker\"]}"
		var clearlineMarkers = "/execute @e[tag=oc_rebuild] ~ ~ ~ kill @e[tag=oc_marker,dx=15,dy=20,dz=15]";
		var clearlineMarkers_old = "kill @e[tag=lineMarker,dx=15,dy=20,dz=15]"; // keep for backwards compatibility
		this.Commands.unshift(gamerule, clearArea, summonMarker, clearlineMarkers, clearlineMarkers_old, summonFilenameMarker);
		
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
	
    FileParser.prototype.processLine = function (line)
	{
		if(line.endsWith('\\'))
		{
			this.PreviousLine += line.replace("\\", "");
			return;
		}
		else
		{
			if(this.PreviousLine.length > 0)
			{
				line = this.PreviousLine + line;
				this.PreviousLine = "";
			}
		}
		
		if(line.indexOf("#") == 0)
		{
			this.processRowLine(line);
		}
		else if(line.indexOf("{") == 0)
		{
			this.processJsonLine(line);
		}
		else if(line.indexOf("/") == 0)
		{
			this.processCommandBlockLine(line);
		}
		else if(line[0] == "!")
		{	
			this.processBangLine(line);
		}
    };
	
	FileParser.prototype.processRowLine = function(line)
	{
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
		var json = JSON.parse(line);
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

	FileParser.prototype.AddBangSetup = function(bangSetup)
	{
		var exists = false;
		this.BangSetups.forEach(function(existingSetup)
		{
			if(bangSetup.setupData == existingSetup.setupData)
				exists = true;
		});
		if(!exists)
			this.BangSetups.push(bangSetup);
	}
	
    return FileParser;
	
})();

module.exports = FileParser;