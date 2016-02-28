var util = require('util');

var CommandCreator = 
{
	IMPULSE_BLOCK_NAME : "command_block",
	REPEATING_BLOCK_NAME : "repeating_command_block",
	CHAIN_BLOCK_NAME : "chain_command_block",
	SETBLOCK_COMMAND_FORMAT : "setblock ~%d ~%d ~%d %s %d replace {Command:\"%s\"%s}",
	UP_DIRECTION_VALUE : 1,
	EAST_DIRECTION_VALUE : 5,
	WEST_DIRECTION_VALUE : 4,
	CONDITIONAL_DIFF_VALUE : 8,
	STARTING_X : 1,
	STARTING_Y : -2,
	STARTING_Z : 0,
	currentX : 1,
	currentY : -2,
	currentZ : 0,
	currentDirection : "east",
	currentType : "impulse",
	currentConditional : false,
	currentAuto : false,
	
	addCommand : function(type, conditional, auto, command)
	{
		var command = CommandCreator.buildCommand(CommandCreator.currentX, 
		                                          CommandCreator.currentY,
												  CommandCreator.currentZ,
												  CommandCreator.currentDirection,
												  type, conditional, auto, command);
		
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
	
	buildCommand : function(x, y, z, direction, type, conditional, auto, command)
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
				
		var setblock = util.format(CommandCreator.SETBLOCK_COMMAND_FORMAT, 
		                           x, y, z,
								   blockName, dataValue, command, autoString);
								   
		return setblock;
	},
	
	startNewLine : function()
	{
		CommandCreator.currentDirection = "east";
		CommandCreator.currentX = CommandCreator.STARTING_X;
		CommandCreator.currentY = CommandCreator.STARTING_Y;
		CommandCreator.currentZ++;
		if(CommandCreator.currentZ == 15)
			console.error("TOO MANY LINES!");
	}
	
}

module.exports = CommandCreator;
