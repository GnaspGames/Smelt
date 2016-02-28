#!/usr/bin/env node

var fs = require('fs');
var util = require('util');

var filePath = process.argv[2];

var debug = process.argv[3] == "debug" ? true : false;
var outputOneCommand = process.argv[3] == "output-command" ? true : false;

var CommandCreator = require("./CommandCreator");

if(filePath)
{
	fs.readFile(filePath, function(err, data) 
	{
		if(!err)
		{
			var content = data.toString().trim();
			var lines = content.split("\n");
			var distanceOffset = 3;
			
			var type = "impulse";
			var conditional = false;
			var auto = true;
			
			var commands = [];
			
			// for(i=lines.length - 1; i >= 0; i--)
			for(i=0; i < lines.length; i++)
			{
				// console.log("LINE:" + i.toString() + ". " + lines[i]);
				
				//var distance = i+distanceOffset;
				var line = lines[i].trim();
				
				if(line.indexOf("#") == 0)
				{
					if(debug)
					{
						console.log("\n\nSTART NEW LINE!")
						console.log(line);
					}
					CommandCreator.startNewLine();
				}
				else if(line.indexOf("{") == 0)
				{
					var json = JSON.parse(line);
					if(json.type != null)
						type = json.type;
					if(json.conditional != null)
						conditional = json.conditional;
					if(json.auto != null)
						auto = json.auto;
					if(debug)
					{
						console.log("  PROCESS JSON OPTIONS!");
						console.log("  " + JSON.stringify(json));
					}
				}
				else if(line.indexOf("/") == 0)
				{
					var command = CommandCreator.addCommand(type, conditional, auto, line);
					commands.unshift(command);
					if(debug)
					{
						console.log("  CREATE COMMAND BLOCK!");
						console.log("  " + line);
						console.log("   -> " + command);
					}
				}
			}
			
			
			
			var gamerule = "gamerule commandBlockOutput false";
			var clearArea = "/fill ~1 ~-2 ~1 ~14 ~10 ~14 air 0";
			commands.unshift(gamerule, clearArea);
			
			
			var removeBlocks = CommandCreator.buildCommand(0, 1, 0, "up", "impulse", false, true, "/fill ~ ~-2 ~ ~ ~ ~ air");
			var removeMinecarts = "kill @e[type=MinecartCommandBlock,r=0]";
			commands.push(removeBlocks, removeMinecarts);
			
			if(debug) console.log("\n\nCREATE IN THIS ORDER:\n");
			
			var minecarts = []
			for(i=0; i < commands.length; i++)
			{
				var command = commands[i];
				var minecart = util.format("{id:MinecartCommandBlock,Command:%s}", JSON.stringify(command));
				minecarts.push(minecart);
				if(debug) console.log(minecart);
			}
			
			
			
			var minecartsString = minecarts.join(",");			
			var oneCommand = "summon FallingSand ~ ~5 ~ {Block:activator_rail,Time:1,Passengers:[%s]}"
			
			oneCommand = util.format(oneCommand, minecartsString);
			
			if(debug || outputOneCommand)
			{
				console.log("\n\nFINAL ONE-COMMAND:\n");
				console.log(oneCommand);
			}
			
			var outputFile = filePath.replace(".mcc", ".oc");
			fs.writeFileSync(outputFile, oneCommand);
			console.log("\n * Saved " + outputFile);
		}
		
	});
}
else
{
	console.log("Please pass a filepath in as the first argument.")
}
