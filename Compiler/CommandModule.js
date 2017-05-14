var util = require('util');
var chalk = require('chalk');
var path = require('path');
var Templates = require("./CommandTemplates");
var Settings = require("../Configuration/Settings");


var CommandModule = (function () 
{
	function CommandModule() 
	{
		this.SourceName = "";
		this.CompiledCommand = "";
		this.Commands = [];
		this.RconSelector = Settings.Current.RCON.Selector;

		this.startX, this.startY, this.startZ, this.stopX, this.stopY, this.stopZ = 0;
		this.border = 0;
		this.lowX, this.lowY, this.lowZ, this.highX, this.highY, this.highZ = 0;
		this.diffX, this.diffY, this.diffZ = 0;
	}

	CommandModule.prototype.setCoordinates = function(x1, y1, z1, x2, y2, z2, border)
	{
		this.startX = x1;
		this.startY = y1;
		this.startZ = z1;
		this.stopX = x2;
		this.stopY = y2;
		this.stopZ = z2;
		
		this.border = border;

		this.lowX = (x1 < x2 ? x1 : x2);
		this.lowY = (y1 < y2 ? y1 : y2);
		this.lowZ = (z1 < z2 ? z1 : z2);
		this.highX = (x1 > x2 ? x1 : x2);
		this.highY = (y1 > y2 ? y1 : y2);
		this.highZ = (z1 > z2 ? z1 : z2);

		this.diffX = (this.highX - this.lowX);
		this.diffY = (this.highY - this.lowY);
		this.diffZ = (this.highZ - this.lowZ);

		this.innerStartX = (this.startX < this.stopX ? (this.startX + this.border) : (this.startX - this.border));
		this.innerStartZ = (this.startZ < this.stopZ ? (this.startZ + this.border) : (this.startZ - this.border));

		this.innerLowX = this.lowX + this.border;
		this.innerLowZ = this.lowZ + this.border;

		this.innerHighX = this.highX - this.border;
		this.innerHighZ = this.highZ - this.border;

		this.innerDiffX = (this.innerHighX - this.innerLowX);
		this.innerDiffZ = (this.innerHighZ - this.innerLowZ);

		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n\n* Setting Module Coordinates:"))
			console.log("  startX: " + this.startX);
			console.log("  startY: " + this.startY);
			console.log("  startZ: " + this.startZ);
			console.log("  stopX: " + this.stopX);
			console.log("  stopY: " + this.stopY);
			console.log("  stopZ: " + this.stopZ);
			console.log("  ---");
			console.log("  border: " + this.border);
			console.log("  ---");
			console.log("  lowX: " + this.lowX);
			console.log("  lowY: " + this.lowY);
			console.log("  lowZ: " + this.lowZ);
			console.log("  ---");
			console.log("  highX: " + this.highX);
			console.log("  highY: " + this.highY);
			console.log("  highZ: " + this.highZ);
			console.log("  ---");
			console.log("  diffX: " + this.diffX);
			console.log("  diffY: " + this.diffY);
			console.log("  diffZ: " + this.diffZ);
			console.log("  ---");
			console.log("  innerStartX: " + this.innerStartX);
			console.log("  innerStartZ: " + this.innerStartZ);
			console.log("  ---");
			console.log("  innerLowX: " + this.innerLowX);
			console.log("  innerLowZ: " + this.innerLowZ);
			console.log("  ---");
			console.log("  innerHighX: " + this.innerHighX);
			console.log("  innerHighZ: " + this.innerHighZ);
			console.log("  ---");
			console.log("  innerDiffX: " + this.innerDiffX);
			console.log("  innerDiffZ: " + this.innerDiffZ);
		}
	};

	CommandModule.prototype.addAdditionalCommands = function()
	{
		// BEFORE ALL COMMANDS: add some setup commands
		var summonRebuildEntityCommand = util.format(
				Templates.Current.SUMMON_REBUILD_ENTITY,
				this.lowX,
				(this.lowY - 1), // lower y by 1 because minecarts execute 1 block up
				this.lowZ
			);

		var clearAreaCommand = util.format(
				Templates.Current.CLEAR_AREA_FORMAT, 
				this.border,
				this.lowY,
				this.border,
				(this.diffX - this.border),
				this.diffY,
				(this.diffZ - this.border)
			);

		var clearMarkersCommand = util.format(
				Templates.Current.CLEAR_MARKERS_FORMAT,
				this.diffX,
				this.diffY,
				this.diffZ
			);

		var summonModuleDisplayMarker = CommandCreator.addNewModuleDisplayMarker(path.basename(this.SourceName));

		if(Settings.Current.Output.ShowDebugInfo)
		{
			console.log(chalk.bold("\n\n* MODULE DISPLAY MARKER"))
			if(summonModuleDisplayMarker) console.log("   -> " + summonModuleDisplayMarker);
			else console.log("   -> " + "No module display marker summoned");
		}

		// Add commands to start of combined command to clear area etc
		this.Commands.unshift(
			Templates.Current.CLEAR_MODULE_DISPLAY_MARKER,
			summonRebuildEntityCommand, 
			clearAreaCommand, 
			clearMarkersCommand,
			summonModuleDisplayMarker
		);

		// AFTER ALL COMMANDS: add some 'clean' up commands
		
		if(Settings.Current.Output.UseRCON)
		{
			this.Commands.push(
				Templates.Current.CLEAR_REBUILD_ENTITY
			);
		}
		else
		{
			// Use a fill command to remove the rail above source block
			var removeBlocksNextTickCommand = CommandCreator.buildSetblockCommand(0, 2, 0, "up", "impulse", false, true, false, "", "/fill ~ ~-1 ~ ~ ~ ~ air");
			
			this.Commands.push(
				removeBlocksNextTickCommand, 
				Templates.Current.CLEAR_REBUILD_ENTITY,
				Templates.Current.CLEAR_MINECARTS
			);
		}

	}

	CommandModule.prototype.addCommand = function(command)
	{
		if(Settings.Current.Commands.CreateInOrderProvided)
			this.Commands.push(command);
		else
			this.Commands.unshift(command);
	};
	
	return CommandModule;
})();

module.exports = CommandModule;

