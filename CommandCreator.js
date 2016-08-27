var util = require('util');
var Settings = require("./Settings");
var Templates = require("./Compiler/CommandTemplates");

var CommandCreator = 
{
	UP_DIRECTION_VALUE : 1,
	EAST_DIRECTION_VALUE : 5,
	WEST_DIRECTION_VALUE : 4,
	CONDITIONAL_DIFF_VALUE : 8,
	STARTING_DIRECTION: "east",
	currentCommandModule: null,
	previousCommandBlock : null,
	currentCommandBlock : null,
	currentDirectionChanged: false,
	executeAs : "",
	markerTag : "",

	fixConditionalCorners : function()
	{
		var commands = [];
		while(CommandCreator.currentDirectionChanged && CommandCreator.currentCommandBlock.conditional)
		{
			var blockName = CommandCreator.getBlockNameForType(CommandCreator.previousCommandBlock.type);

			var testforblockCmd = util.format
			(
				Templates.Current.TESTFORBLOCK_COMMAND_FORMAT, 
				CommandCreator.previousCommandBlock.getRelativeX(),
				CommandCreator.previousCommandBlock.getRelativeY(),
				CommandCreator.previousCommandBlock.getRelativeZ(),
				blockName
			);

			var setblockCmd = CommandCreator.buildSetblockCommand
			(
				CommandCreator.currentCommandBlock.x, 
				CommandCreator.currentCommandBlock.y,
				CommandCreator.currentCommandBlock.z,
				CommandCreator.currentCommandBlock.direction,
				CommandCreator.currentCommandBlock.type,
				false, 
				CommandCreator.currentCommandBlock.auto, 
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
		// Check if roof has been reached
		if(CommandCreator.currentCommandBlock.y > CommandCreator.currentCommandModule.highY)
			throw Error("The maximum y position has been met! You need to either decrease the size of the row, split up your row, or increase the allowed size of your modules.");

		if(CommandCreator.currentCommandBlock.z > CommandCreator.currentCommandModule.innerHighZ)
			throw Error("The maximum z position has been met! You need to either decrease the number of rows, split up your module, or increase the allowed size of your modules.");

		var command = CommandCreator.buildSetblockCommand
		(
			CommandCreator.currentCommandBlock.x, 
			CommandCreator.currentCommandBlock.y,
			CommandCreator.currentCommandBlock.z,
			CommandCreator.currentCommandBlock.direction,
			CommandCreator.currentCommandBlock.type,
			CommandCreator.currentCommandBlock.conditional, 
			CommandCreator.currentCommandBlock.auto, 
			CommandCreator.executeAs,
			command
		);
		
		CommandCreator.incrementSetblockVars();
		
		return command;
	},
	incrementSetblockVars : function()
	{
		
		// Replace previous command block details
		CommandCreator.previousCommandBlock = new CommandBlock
		(
			CommandCreator.currentCommandBlock.x,
			CommandCreator.currentCommandBlock.y,
			CommandCreator.currentCommandBlock.z,
			CommandCreator.currentCommandBlock.direction,
			CommandCreator.currentCommandBlock.type,
			CommandCreator.currentCommandBlock.conditional,
			CommandCreator.currentCommandBlock.auto
		);
		
		// Set details for next commandblock
		
		CommandCreator.currentDirectionChanged = false;
		switch(CommandCreator.currentCommandBlock.direction)
		{
			case "east":
				CommandCreator.currentCommandBlock.x++;
				if(CommandCreator.currentCommandBlock.x == CommandCreator.currentCommandModule.innerHighX)
				{
					CommandCreator.currentCommandBlock.direction = "up";
					CommandCreator.currentDirectionChanged = true;
				}
			break;
			case "west":
				CommandCreator.currentCommandBlock.x--;
				if(CommandCreator.currentCommandBlock.x == CommandCreator.currentCommandModule.innerLowX)
				{
					CommandCreator.currentCommandBlock.direction = "up";
					CommandCreator.currentDirectionChanged = true;
				}
			break;
			case "up":

				// Increment z position to move up 1 block
				CommandCreator.currentCommandBlock.y++;
				
				// Set new direction depending on which end of the row we're on
				if(CommandCreator.currentCommandBlock.x == CommandCreator.currentCommandModule.innerHighX)
				{
					CommandCreator.currentCommandBlock.direction = "west";
					CommandCreator.currentDirectionChanged = true;
				}
				else if(CommandCreator.currentCommandBlock.x == CommandCreator.currentCommandModule.innerLowX)
				{
					CommandCreator.currentCommandBlock.direction = "east";
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
		
		// lower y by 1 because minecarts execute 1 block up
		y = (y - 1);

		var setblock = util.format(Templates.Current.SETBLOCK_COMMAND_FORMAT, 
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
				blockName = Templates.Current.IMPULSE_BLOCK_NAME;
				if(allowSwitchToChain) CommandCreator.currentCommandBlock.type = "chain";
				break;
			case "repeating-chain":
				blockName = Templates.Current.REPEATING_BLOCK_NAME;
				if(allowSwitchToChain) CommandCreator.currentCommandBlock.type = "chain";
				break;
			case "impulse":
				blockName = Templates.Current.IMPULSE_BLOCK_NAME;
				break;
			case "repeating":
				blockName = Templates.Current.REPEATING_BLOCK_NAME;
				break;
			case "chain":
				blockName = Templates.Current.CHAIN_BLOCK_NAME;
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
					format = Templates.Current.SUMMON_AEC_CMD_MARKER_FORMAT;
					break;
				case "ArmorStand":
				default:
					format = Templates.Current.SUMMON_ARMORSTAND_CMD_MARKER_FORMAT;
					break;
			}

			summon = util.format
			(
				format, 
				CommandCreator.currentCommandBlock.x,
				CommandCreator.currentCommandBlock.y, 
				CommandCreator.currentCommandBlock.z, 
				CommandCreator.markerTag
			);
		}
		return summon;
	},
	addNewRowDisplayMarker : function(line)
	{
		var customName = line.replace("#", "").trim();
		var summon;
		if(Settings.Current.Markers.SummonRowMarkers)
			summon = CommandCreator.addNewDisplayMarker(
				customName,
				CommandCreator.currentCommandModule.lowX,
				CommandCreator.currentCommandModule.lowY,
				CommandCreator.currentCommandBlock.z
			);
		return summon;
	},
	addNewModuleDisplayMarker : function(fileName)
	{
		var customName = fileName.trim();
		var summon;
		if(Settings.Current.Markers.SummonFileMarkers)
			summon = CommandCreator.addNewDisplayMarker(customName, 0, 0, 0);
		return summon;
	},
	addNewDisplayMarker : function(customName, x, y, z)
	{
		var summon;
		if(customName.length != 0)
		{
			var format = "";
			switch (Settings.Current.Markers.EntityType) 
			{
				case "AreaEffectCloud":
					format = Templates.Current.SUMMON_AEC_DISPLAY_MARKER_FORMAT;
					break;
				case "ArmorStand":
				default:
					format = Templates.Current.SUMMON_ARMORSTAND_DISPLAY_MARKER_FORMAT;
					break;
			}
			summon = util.format(format, x, y, z, customName);
		}
		return summon;
	},
	firstRowCreated : false,
	startNewRow : function(line)
	{
		CommandCreator.previousCommandBlock = null;

		CommandCreator.currentCommandBlock.direction = CommandCreator.STARTING_DIRECTION;
		CommandCreator.currentCommandBlock.x = CommandCreator.currentCommandModule.innerStartX;
		CommandCreator.currentCommandBlock.y = CommandCreator.currentCommandModule.startY;

		if(CommandCreator.firstRowCreated)
			CommandCreator.currentCommandBlock.z++;
		else
			CommandCreator.firstRowCreated = true;
		
		return CommandCreator.addNewRowDisplayMarker(line);
	},
	startNewFile : function(commandModule)
	{
		CommandCreator.currentCommandModule = commandModule;

		CommandCreator.previousCommandBlock = null;
		
		CommandCreator.currentCommandBlock = new CommandBlock
		(
			CommandCreator.currentCommandModule.innerStartX,
			CommandCreator.currentCommandModule.startY,
			CommandCreator.currentCommandModule.innerStartZ,
			CommandCreator.STARTING_DIRECTION,
			Settings.Current.Commands.DefaultCommandBlockType,
			Settings.Current.Commands.DefaultConditionalValue,
			Settings.Current.Commands.DefaultAutoValue
		);

		CommandCreator.executeAs = "";
		CommandCreator.markerTag = "";
	},
	processJSONLine : function(json)
	{
		if(json.type != null)
			CommandCreator.currentCommandBlock.type = json.type; 
		if(json.conditional != null)
			CommandCreator.currentCommandBlock.conditional = json.conditional; 
		if(json.auto != null)
			CommandCreator.currentCommandBlock.auto = json.auto;
		if(json.executeAs != null)
			CommandCreator.executeAs = json.executeAs;
		if(json.markerTag != null)
			CommandCreator.markerTag = json.markerTag;
	}
}

module.exports = CommandCreator;
