var util = require('util');
var fs = require('fs');
var CommandCreator = require("./CommandCreator");

var FileParser = (function () 
{
    function FileParser() 
	{
		this.Commands = [];
		this.Debug = false;
		this.OutputCommand = false;
	}
	
    FileParser.prototype.ProcessFile = function (filePath)
	{
		CommandCreator.startNewFile();
		
		var data = fs.readFileSync(filePath);

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
			this.processLine(line);
		}
		
		var gamerule = "gamerule commandBlockOutput false";
		var clearArea = "fill ~1 ~-2 ~1 ~14 ~10 ~14 air 0";
		var clearlineMarkers1= "summon ArmorStand ~ ~-2 ~ {Tags:[\"\lineMarker\",\"clearlineMarkers\"]}";
		var clearlineMarkers2 = "execute @e[tag=clearlineMarkers] ~ ~ ~ kill @e[tag=lineMarker,dx=15,dy=20,dz=15]";
		this.Commands.unshift(gamerule, clearArea, clearlineMarkers1, clearlineMarkers2);
		
		var removeBlocks = CommandCreator.buildSetblockCommand(0, 1, 0, "up", "impulse", false, true, "", "/fill ~ ~-2 ~ ~ ~ ~ air");
		
		var removeMinecarts = "kill @e[type=MinecartCommandBlock,r=0]";
		this.Commands.push(removeBlocks, removeMinecarts);
		
		//if(this.Debug) console.log("\n\nCREATE IN THIS ORDER:\n");
		
		var minecarts = []
		for(i=0; i < this.Commands.length; i++)
		{
			var command = this.Commands[i];
			var minecart = util.format("{id:MinecartCommandBlock,Command:%s}", command); 
			minecarts.push(minecart);
			//if(this.Debug) console.log(minecart);
		}
		
		var minecartsString = minecarts.join(",");			
		var oneCommand = "summon FallingSand ~ ~5 ~ {Block:activator_rail,Time:1,Passengers:[%s]}"
		
		oneCommand = util.format(oneCommand, minecartsString);
		
		if(this.Debug || this.OutputCommand)
		{
			console.log("\n\nFINAL ONE-COMMAND:\n");
			console.log(oneCommand);
		}
		
		var outputFile = filePath.replace(".mcc", ".oc");
		fs.writeFileSync(outputFile, oneCommand);
		console.log("\n * Saved " + outputFile);
    };
	
    FileParser.prototype.processLine = function (line)
	{
		if(line.indexOf("#") == 0)
		{
			var summon = CommandCreator.startNewLine(line);
			if(summon) this.Commands.unshift(summon);
			if(this.Debug)
			{
				console.log("\n\n  START NEW LINE!")
				console.log("  " + line);
				if(summon) console.log("   -> " + summon);
			}
		}
		else if(line.indexOf("{") == 0)
		{
			var json = JSON.parse(line);
			CommandCreator.processJSONLine(json);
			if(this.Debug)
			{
				console.log("  PROCESS JSON OPTIONS!");
				console.log("  " + JSON.stringify(json));
			}
		}
		else if(line.indexOf("/") == 0)
		{
			var command = CommandCreator.addSetblockCommand(line);
			this.Commands.unshift(command);
			if(this.Debug)
			{
				console.log("  CREATE COMMAND BLOCK!");
				console.log("  " + line);
				console.log("   -> " + command);
			}
		}
    };
	
    return FileParser;
	
})();

module.exports = FileParser;