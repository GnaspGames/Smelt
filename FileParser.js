var util = require('util');
var fs = require('fs');
var CommandCreator = require("./CommandCreator");
var BangCommandHelper = require("./BangCommandHelper");
var Program = require("./Program");

var FileParser = (function () 
{
    function FileParser() 
	{
		this.Commands = [];
		this.BangSetups = [];
	}
	
    FileParser.prototype.ProcessFile = function (filePath)
	{
		var data = fs.readFileSync(filePath);
		
		console.log(util.format("\n\nProcessing %s", filePath));
		this.ProcessData(data, filePath);
		
		if(this.BangSetups.length)
		{
			var self = this;
			this.BangSetups.forEach(function(setup)
			{
				console.log(util.format("\n\nTo use the \"!%s\" command you will need to also install the following command into your world:", setup.bangName));
				self.ProcessData(setup.setupData, setup.fileName);
			});
			
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
		
		for(i=0; i < lines.length; i++)
		{
			var line = lines[i].trim();
			
			try
			{
				this.processLine(line);
			}
			catch(err)
			{
				console.log("\n\n  LINE ERROR!");
				console.log(util.format("  Error on %s:%d - %s\n\n", sourceName, i, err));
				throw err;
			}
		}
		
		var gamerule = "gamerule commandBlockOutput false";
		var clearArea = "fill ~1 ~-1 ~1 ~14 ~10 ~14 air 0";
		var clearlineMarkers = "kill @e[tag=lineMarker,dx=15,dy=20,dz=15]";
		this.Commands.unshift(gamerule, clearArea, clearlineMarkers);
		
		var removeBlocks = CommandCreator.buildSetblockCommand(0, 1, 0, "up", "impulse", false, true, "", "/fill ~ ~-1 ~ ~ ~ ~ air");
		
		var removeMinecarts = "kill @e[type=MinecartCommandBlock,r=0]";
		this.Commands.push(removeBlocks, removeMinecarts);
		
		//if(Program.Debug) console.log("\n\nCREATE IN THIS ORDER:\n");
		
		var minecarts = []
		for(i=0; i < this.Commands.length; i++)
		{
			var command = this.Commands[i];
			var minecart = util.format("{id:MinecartCommandBlock,Command:%s}", JSON.stringify(command)); 
			minecarts.push(minecart);
			//if(Program.Debug) console.log(minecart);
		}
		
		var minecartsString = minecarts.join(",");			
		var oneCommand = "summon FallingSand ~ ~1 ~ {Block:activator_rail,Time:1,Passengers:[%s]}"
		
		oneCommand = util.format(oneCommand, minecartsString);
		
		if(Program.Debug || Program.OutputCommand)
		{
			console.log("\n\ONE-COMMAND:\n");
			console.log(oneCommand);
		}
		
		var outputFileName = sourceName.replace(".mcc", ".oc");
		fs.writeFileSync(outputFileName, oneCommand);
		console.log("\n * Saved " + outputFileName);
		
	};
	
    FileParser.prototype.processLine = function (line)
	{
		if(line.indexOf("#") == 0)
		{
			var summon = CommandCreator.startNewLine(line);
			if(summon) this.Commands.unshift(summon);
			if(Program.Debug)
			{
				console.log("\n\n* START NEW LINE!")
				console.log("  " + line);
				if(summon) console.log("   -> " + summon);
			}
		}
		else if(line.indexOf("{") == 0)
		{
			var json = JSON.parse(line);
			CommandCreator.processJSONLine(json);
			if(Program.Debug)
			{
				console.log("\n* PROCESS JSON OPTIONS");
				console.log("  " + JSON.stringify(json));
			}
		}
		else if(line.indexOf("/") == 0)
		{
			var command = CommandCreator.addSetblockCommand(line);
			this.Commands.unshift(command);
			if(Program.Debug)
			{
				console.log("\n* CREATE COMMAND BLOCK");
				console.log("  " + line);
				console.log("   -> " + command);
			}
		}
		else if(line[0] == "!")
		{	
			if(Program.Debug)
			{
				console.log("\n* PROCESS BANG COMMAND");
				console.log("  " + line);
				console.log("  Commands generated:");
			}
			var commands = BangCommandHelper.ProcessBang(line, this);
			if(commands.length > 0)
			{
				var self = this;
				commands.forEach(function(command)
				{
					if(Program.Debug) console.log("   -> " + command);
					self.Commands.unshift(command);
				});
			}
		}
    };
	
    return FileParser;
	
})();

module.exports = FileParser;