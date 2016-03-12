var util = require('util');

var CommandCreator = 
{
	IMPULSE_BLOCK_NAME : "command_block",
	REPEATING_BLOCK_NAME : "repeating_command_block",
	CHAIN_BLOCK_NAME : "chain_command_block",
	SETBLOCK_COMMAND_FORMAT : "setblock ~%d ~%d ~%d %s %d replace {Command:%s%s}",
	SUMMON_LINE_MARKER_FORMAT : "summon ArmorStand ~ ~ ~%d {CustomName:%s,Tags:[\"lineMarker\"],Marker:1b,CustomNameVisible:1b,Invulnerable:1b,NoGravity:1b,Invisible:1b}",
	UP_DIRECTION_VALUE : 1,
	EAST_DIRECTION_VALUE : 5,
	WEST_DIRECTION_VALUE : 4,
	CONDITIONAL_DIFF_VALUE : 8,
	STARTING_X : 1,
	STARTING_Y : -1,
	STARTING_Z : 0,
	currentX : 1,
	currentY : -1,
	currentZ : 0,
	currentDirection : "east",
	type : "impulse",
	conditional : false,
	auto : true,
	executeAs : "",
	
	addSetblockCommand : function(command)
	{
		var command = CommandCreator.buildSetblockCommand(
			CommandCreator.currentX, 
			CommandCreator.currentY,
			CommandCreator.currentZ,
			CommandCreator.currentDirection,
			CommandCreator.type,
			CommandCreator.conditional, 
			CommandCreator.auto, 
			CommandCreator.executeAs,
			command);
		
		// Set details for NEXT commandblock
		switch(CommandCreator.currentDirection)
		{
			case "east":
				CommandCreator.currentX++;
				if(CommandCreator.currentX == 14)
					CommandCreator.currentDirection = "up";
			break;
			case "west":
				CommandCreator.currentX--;
				if(CommandCreator.currentX == 1)
					CommandCreator.currentDirection = "up";
			break;
			case "up":
				CommandCreator.currentY++;
				if(CommandCreator.currentX == 14)
					CommandCreator.currentDirection = "west";
				else if(CommandCreator.currentX == 1)
					CommandCreator.currentDirection = "east";
			break;
		}
		
		return command;
	},
	
	buildSetblockCommand : function(x, y, z, direction, type, conditional, auto, executeAs, command)
	{
		var blockName = "";
		switch(type)
		{
			case "impulse":
				blockName = CommandCreator.IMPULSE_BLOCK_NAME;
				break;
			case "repeating":
				blockName = CommandCreator.REPEATING_BLOCK_NAME;
				break;
			case "chain":
				blockName = CommandCreator.CHAIN_BLOCK_NAME;
				break;
		}
		
		var dataValue = 100;
		switch(direction)
		{
			case "east":
				dataValue = CommandCreator.EAST_DIRECTION_VALUE;
				break;
			case "west":
				dataValue = CommandCreator.WEST_DIRECTION_VALUE;
				break;
			case "up":
				dataValue = CommandCreator.UP_DIRECTION_VALUE;
				break;
		}
		
		if(conditional)
			dataValue = dataValue + CommandCreator.CONDITIONAL_DIFF_VALUE;
		
		var autoString = "";
		if(auto == true) autoString = ",auto:1b";
		
		if(executeAs != "")
			command = util.format("/execute %s ~ ~ ~ %s", executeAs, command);
		
		var setblock = util.format(CommandCreator.SETBLOCK_COMMAND_FORMAT, 
		                           x, y, z,
								   blockName, dataValue, JSON.stringify(command), autoString);
								   
		return setblock;
	},
	addNewLineMarker : function(line)
	{
		var summon;
		var customName = line.replace("#", "").trim();
		if(customName.length != 0)
		{
			var summon = util.format(CommandCreator.SUMMON_LINE_MARKER_FORMAT, CommandCreator.currentZ, customName);
		}
		return summon;
	},
	startNewLine : function(line)
	{
		CommandCreator.currentDirection = "east";
		CommandCreator.currentX = CommandCreator.STARTING_X;
		CommandCreator.currentY = CommandCreator.STARTING_Y;
		CommandCreator.currentZ++;
		// CommandCreator.currentZ == 15)
		//	console.error("TOO MANY LINES!");
		
		return CommandCreator.addNewLineMarker(line);
	},
	
	startNewFile : function()
	{
		CommandCreator.currentDirection = "east";
		CommandCreator.currentX = CommandCreator.STARTING_X;
		CommandCreator.currentY = CommandCreator.STARTING_Y;
		CommandCreator.currentZ = CommandCreator.STARTING_Z;
		CommandCreator.type = "impulse";
		CommandCreator.conditional = false;
		CommandCreator.auto = true;
		CommandCreator.executeAs = "";
	},
	
	processJSONLine : function(json)
	{
		if(json.type != null)
			CommandCreator.type = json.type;
		if(json.conditional != null)
			CommandCreator.conditional = json.conditional;
		if(json.auto != null)
			CommandCreator.auto = json.auto;
		if(json.executeAs != null)
			CommandCreator.executeAs = json.executeAs;
	}
	
}

module.exports = CommandCreator;
