var util = require('util');
var Settings = require("./Settings");

var CommandCreator = 
{
	IMPULSE_BLOCK_NAME : "command_block",
	REPEATING_BLOCK_NAME : "repeating_command_block",
	CHAIN_BLOCK_NAME : "chain_command_block",
	TESTFORBLOCK_COMMAND_FORMAT: "testforblock ~%d ~%d ~%d minecraft:%s -1 {SuccessCount:1}",
	SETBLOCK_COMMAND_FORMAT : "setblock ~%d ~%d ~%d %s %d replace {Command:%s%s}",
	SUMMON_ARMORSTAND_DISPLAY_MARKER_FORMAT : "summon ArmorStand ~ ~ ~%d {CustomName:%s, Tags:[\"oc_marker\"], Marker:1b, CustomNameVisible:1b, Invulnerable:1b, NoGravity:1b, Invisible:1b}",
	SUMMON_ARMORSTAND_CMD_MARKER_FORMAT : "summon ArmorStand ~%d ~%d ~%d {Tags:[\"oc_marker\",\"%s\"], Marker:1b, Invulnerable:1b, NoGravity:1b}",	
	SUMMON_AEC_DISPLAY_MARKER_FORMAT : "summon AreaEffectCloud ~ ~ ~%d {CustomName:%s, CustomNameVisible:1b, Tags:[\"oc_marker\"], Duration:2147483647}",
	SUMMON_AEC_CMD_MARKER_FORMAT : "summon AreaEffectCloud ~%d ~%d ~%d {Tags:[\"oc_marker\",\"%s\"], Duration:2147483647}",
	UP_DIRECTION_VALUE : 1,
	EAST_DIRECTION_VALUE : 5,
	WEST_DIRECTION_VALUE : 4,
	CONDITIONAL_DIFF_VALUE : 8,
	STARTING_X : 1,
	STARTING_Y : -1,
	STARTING_Z : 0,
	previousX : 0,
	previousY : 0,
	previousZ : 0,
	currentX : 1,
	currentY : -1,
	currentZ : 0,
	currentDirection : "east",
	currentDirectionChanged: false,
	previousType: "",
	type : "",
	conditional : false,
	auto : false,
	executeAs : "",
	markerTag : "",

	fixConditionalCorners : function()
	{
		var commands = [];
		while(CommandCreator.currentDirectionChanged && CommandCreator.conditional)
		{
			var blockName = CommandCreator.getBlockNameForType(CommandCreator.previousType);

			var testforblockCmd = util.format(
				CommandCreator.TESTFORBLOCK_COMMAND_FORMAT, 
				(CommandCreator.previousX - CommandCreator.currentX),
				(CommandCreator.previousY - CommandCreator.currentY),
				(CommandCreator.previousZ - CommandCreator.currentZ),
				blockName
			);

			var setblockCmd = CommandCreator.buildSetblockCommand(
				CommandCreator.currentX, 
				CommandCreator.currentY,
				CommandCreator.currentZ,
				CommandCreator.currentDirection,
				CommandCreator.type,
				false, 
				CommandCreator.auto, 
				CommandCreator.executeAs,
				testforblockCmd
			);

			commands.push(setblockCmd);

			CommandCreator.incrementSetblockVars();
		}
		return commands;
	},
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
		
		CommandCreator.incrementSetblockVars();
		
		return command;
	},
	incrementSetblockVars : function()
	{
		// Set details for next commandblock
		
		CommandCreator.previousType = CommandCreator.type;
		CommandCreator.previousX = CommandCreator.currentX;
		CommandCreator.previousY = CommandCreator.currentY;
		CommandCreator.previousZ = CommandCreator.currentZ;

		CommandCreator.currentDirectionChanged = false;
		switch(CommandCreator.currentDirection)
		{
			case "east":
				CommandCreator.currentX++;
				if(CommandCreator.currentX == 14)
				{
					CommandCreator.currentDirection = "up";
					CommandCreator.currentDirectionChanged = true;
				}
			break;
			case "west":
				CommandCreator.currentX--;
				if(CommandCreator.currentX == 1)
				{
					CommandCreator.currentDirection = "up";
					CommandCreator.currentDirectionChanged = true;
				}
			break;
			case "up":
				CommandCreator.currentY++;
				if(CommandCreator.currentX == 14)
				{
					CommandCreator.currentDirection = "west";
					CommandCreator.currentDirectionChanged = true;
				}
				else if(CommandCreator.currentX == 1)
				{
					CommandCreator.currentDirection = "east";
					CommandCreator.currentDirectionChanged = true;
				}
			break;
		}


	},
	buildSetblockCommand : function(x, y, z, direction, type, conditional, auto, executeAs, command)
	{
		var blockName = CommandCreator.getBlockNameForType(type, true);
		
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
	getBlockNameForType : function(type, allowSwitchToChain)
	{
		var blockName = "";
		switch(type)
		{
			case "impulse-chain":
				blockName = CommandCreator.IMPULSE_BLOCK_NAME;
				if(allowSwitchToChain) CommandCreator.type = "chain";
				break;
			case "repeating-chain":
				blockName = CommandCreator.REPEATING_BLOCK_NAME;
				if(allowSwitchToChain) CommandCreator.type = "chain";
				break;
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
		return blockName;
	},
	addNewCmdMarker : function()
	{ 
		var summon;
		if(CommandCreator.markerTag.length != 0)
		{
			var format = "";

			switch (Settings.Current.Markers.EntityType) 
			{
				case "AreaEffectCloud":
					format = CommandCreator.SUMMON_AEC_CMD_MARKER_FORMAT;
					break;
				case "ArmorStand":
				default:
					format = CommandCreator.SUMMON_ARMORSTAND_CMD_MARKER_FORMAT;
					break;
			}

			summon = util.format(format, 
				CommandCreator.currentX,
				CommandCreator.currentY, 
				CommandCreator.currentZ, 
				CommandCreator.markerTag);
		}
		return summon;
	},
	addNewLineMarker : function(line)
	{
		var customName = line.replace("#", "").trim();
		var summon;
		if(Settings.Current.Markers.SummonRowMarkers)
			summon = CommandCreator.addNewDisplayMarker(customName);
		return summon;
	},
	addNewFileMarker : function(fileName)
	{
		var customName = fileName.trim();
		var summon;
		if(Settings.Current.Markers.SummonFileMarkers)
			summon = CommandCreator.addNewDisplayMarker(customName);
		return summon;
	},
	addNewDisplayMarker : function(customName)
	{
		var summon;
		if(customName.length != 0)
		{
			var format = "";
			switch (Settings.Current.Markers.EntityType) 
			{
				case "AreaEffectCloud":
					format = CommandCreator.SUMMON_AEC_DISPLAY_MARKER_FORMAT;
					break;
				case "ArmorStand":
				default:
					format = CommandCreator.SUMMON_ARMORSTAND_DISPLAY_MARKER_FORMAT;
					break;
			}
			summon = util.format(format, CommandCreator.currentZ, customName);
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
		CommandCreator.type = Settings.Current.Commands.DefaultCommandBlockType;
		CommandCreator.conditional = Settings.Current.Commands.DefaultConditionalValue;
		CommandCreator.auto = Settings.Current.Commands.DefaultAutoValue;
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
		if(json.markerTag != null)
			CommandCreator.markerTag = json.markerTag;
	}
}

module.exports = CommandCreator;
