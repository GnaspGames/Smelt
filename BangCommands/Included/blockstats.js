// Authors: bananenbroek4 & Gnasp

// ----------------------
// --   stats   --
// ----------------------
// Usage: !blockstats <clear|set> <stat> <selector> <objective>
// <stat> values: AffectedBlocks | AffectedEntities | AffectedItems | QueryResult | SuccessCount
//	
//	Add or removes stats from the previous command block

var util = require('util');

var BlockStats =
	{
		Execute: function (smelt)
		{
      if (smelt.settings.Output.MinecraftVersion == "1.13") {
         throw new Error("!blockstats is impossible in 1.13!");
      }
			// Get arguments
			var operation = smelt.args[0];
			
			if(!(operation == "clear" || operation == "set"))
			{
				throw new Error("First argument must be either 'clear' or 'set'")
			}
			
			var stat = smelt.args[1];
			var selector = smelt.args[2];
			var objective = smelt.args[3];

			var previousCbX = smelt.getPreviousCommandBlock().x;
			var previousCbY = smelt.getPreviousCommandBlock().y - 1; // Why -1? Because of strange offset smelt needs due to Minecarts.
			var previousCbZ = smelt.getPreviousCommandBlock().z;
			var previousCbType = smelt.getPreviousCommandBlock().type;
			var previousCbCondition = smelt.getPreviousCommandBlock().conditional;

			// Generate a command matching either of below
			var command = "";
			if(operation == "clear")
			{
				// stats block <x> <y> <z> clear <stat>
				command = util.format("stats block ~%s ~%s ~%s clear %s", previousCbX, previousCbY, previousCbZ, stat);
			}
			else
			{
				// stats block <x> <y> <z> set <stat> <selector> <objective>
				command = util.format("stats block ~%s ~%s ~%s set %s %s %s", previousCbX, previousCbY, previousCbZ, stat, selector, objective);
			}

			smelt.addInitCommand(command);
		}
	}

module.exports = BlockStats;