var util = require('util');
var Templates = require("./CommandTemplates");

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
	conditionalCornerBlockCount: 0, // Used to make sure that fixConditionalCorners() always uses an even number of cmd blocks. 

	fixConditionalCorners : function()
	{
		var commands = [];

		var checkIfFillBlockNeeded = function()
		{
			var isNeeded = false;
			if(Math.abs(CommandCreator.conditionalCornerBlockCount % 2) == 1) // if ODD
			{
				// The number of cmd blocks used to fill out a conditional corner must ALWAYS be EVEN.
				// IF the number of blocks used is ODD, another one is needed.
				isNeeded = true;
			}
			else if(CommandCreator.currentDirectionChanged && CommandCreator.currentCommandBlock.conditional)
			{
				isNeeded = true;
			}
			return isNeeded;
		}

		while(checkIfFillBlockNeeded())
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
				false, // conditional not used here
				CommandCreator.currentCommandBlock.auto, 
				CommandCreator.currentCommandBlock.trackOutput, 
				"", // executeAs not used here
				testforblockCmd
			);

			// Increment the number of cmd blocks used (so that we can make sure an even number is used).
			CommandCreator.conditionalCornerBlockCount++;

			commands.push(setblockCmd);

			CommandCreator.incrementSetblockVars();
		}

		// Reset the number of cmd blocks used to zero for next time.
		CommandCreator.conditionalCornerBlockCount = 0;

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
			CommandCreator.currentCommandBlock.trackOutput,
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
	buildSetblockCommand : function(x, y, z, direction, type, conditional, auto, trackOutput, executeAs, command)
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

		var trackOutputString = "";
		if(trackOutput == false) trackOutputString = ",TrackOutput:0b";
		
		if(executeAs != "")
			command = util.format("/execute %s ~ ~ ~ %s", executeAs, command);
		
		// lower y by 1 because minecarts execute 1 block up
		y = (y - 1);

		var setblock = util.format(Templates.Current.SETBLOCK_COMMAND_FORMAT, 
								   x, y, z,
								   blockName, dataValue, JSON.stringify(command), autoString, trackOutputString);
		
		return setblock;
	},
	getBlockNameForType : function(type, allowSwitchToChain)
	{
		var blockName = "";
		switch(type)
		{
			case "impulse-chain":
				blockName = Templates.Current.IMPULSE_BLOCK_NAME;
				if(allowSwitchToChain) 
				{
					CommandCreator.currentCommandBlock.type = "chain";
					CommandCreator.currentCommandBlock.auto = true;
				}
				break;
			case "repeating-chain":
				blockName = Templates.Current.REPEATING_BLOCK_NAME;
				if(allowSwitchToChain) 
				{
					CommandCreator.currentCommandBlock.type = "chain";
					CommandCreator.currentCommandBlock.auto = true;
				}
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
				(CommandCreator.currentCommandBlock.y - 1), // lower y by 1 because minecarts execute 1 block up
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
				(CommandCreator.currentCommandModule.lowY - 1), // lower y by 1 because minecarts execute 1 block up
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
			Settings.Current.Commands.DefaultAutoValue,
			Settings.Current.Commands.DefaultTrackOutput
		);

		CommandCreator.executeAs = "";
		CommandCreator.markerTag = "";
	},
	processJSONLine : function(json)
	{
		// Command Block Settings
		if(json.type != null)
			CommandCreator.currentCommandBlock.type = json.type; 
		if(json.conditional != null)
			CommandCreator.currentCommandBlock.conditional = json.conditional; 
		if(json.auto != null)
			CommandCreator.currentCommandBlock.auto = json.auto;
		if(json.trackOutput != null)
			CommandCreator.currentCommandBlock.trackOutput = json.trackOutput;
		if(json.executeAs != null)
			CommandCreator.executeAs = json.executeAs;
		if(json.markerTag != null)
			CommandCreator.markerTag = json.markerTag;
		
		// Module Settings
		var resetModuleSize = false;

		var startX = Settings.Current.Modules.StartX;
		var startY = Settings.Current.Modules.StartY;
		var startZ = Settings.Current.Modules.StartZ;
		var stopX = Settings.Current.Modules.StopX;
		var stopY = Settings.Current.Modules.StopY;
		var stopZ = Settings.Current.Modules.StopZ;
		var border = Settings.Current.Modules.Border;

		if(json.moduleStartX != null)
		{ startX = json.moduleStartX; resetModuleSize = true; }

		if(json.moduleStartY != null)
		{ startY = json.moduleStartY; resetModuleSize = true; }

		if(json.moduleStartZ != null)
		{ startZ = json.moduleStartZ; resetModuleSize = true; }

		if(json.moduleStopX != null)
		{ stopX = json.moduleStopX; resetModuleSize = true; }

		if(json.moduleStopY != null)
		{ stopY = json.moduleStopY; resetModuleSize = true; }

		if(json.moduleStopZ != null)
		{ stopZ = json.moduleStopZ; resetModuleSize = true; }

		if(json.moduleBorder != null)
		{ border = json.moduleBorder; resetModuleSize = true; }

		if(resetModuleSize)
		{
			this.currentCommandModule.setCoordinates(
				startX, startY, startZ, stopX, stopY, stopZ, border
			);
		}

	}
}

module.exports = CommandCreator;
