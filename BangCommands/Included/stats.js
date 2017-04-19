// ----------------------
// --   stats   --
// ----------------------
// Usage: !stats <entity|block>
// For entity:  !stats entity <selector> <clear|set> <mode> <selector> <objective>
// For block:  	!stats block <clear|set> <mode> <selector> <objective>

// Mode selections: AffectedBlocks | AffectedEntities | AffectedItems | QueryResult | SuccessCount

/*	
	Detects whether the previous commandblock has 0 successful executions (tag "{SuccessCount:0}")"
*/

var Stats =
	{
		Execute: function (smelt)
		{

			var util = require('util');

			var test_Location_X = smelt.getPreviousCommandBlock().x;
			var test_Location_Y = smelt.getPreviousCommandBlock().y - 1; // Why -1? Because of strange offset smelt needs due to Minecarts.
			var test_Location_Z = smelt.getPreviousCommandBlock().z;
			var test_CBType = smelt.getPreviousCommandBlock().type;
			var test_CBCondition = smelt.getPreviousCommandBlock().conditional;

			if (test_CBCondition)
			{
				var conditionalState = true
			}

			var result_Location_X = smelt.getCurrentCommandBlock().x;
			var result_Location_Y = smelt.getCurrentCommandBlock().y;
			var result_Location_Z = smelt.getCurrentCommandBlock().z;

			var difference_Location_X = test_Location_X - result_Location_X;
			var difference_Location_Y = test_Location_Y - result_Location_Y;
			var difference_Location_Z = test_Location_Z - result_Location_Z;


			var type = smelt.args[0];

			if (type == "entity" || (type !== "block" && type !== "entity")) 
			{
				var fromSelector = smelt.args[1];

				var startString = "/stats " + type + " " + fromSelector;

				operation = smelt.args[2];
				switch (operation) 
				{
					case "set": break;
					case "clear": break;
					default: operation = "set"; break;
				}
				mode = smelt.args[3];

				var endString = operation + " " + mode;
				if (operation !== "clear")
				{
					targetSelector = smelt.args[4];
					objective = smelt.args[5];
					var endString = operation + " " + mode + " " + targetSelector + " " + objective;
				}
			}
			else 
			{
				var type = "block";
				relCoords = "~" + test_Location_X + " ~" + test_Location_Y + " ~" + test_Location_Z;

				var startString = "/stats " + type + " " + relCoords;

				operation = smelt.args[1];
				switch (operation)
				{
					case "set": break;
					case "clear": break;
					default: operation = "set"; break;
				}
				mode = smelt.args[2];

				var endString = operation + " " + mode;
				if (operation !== "clear")
				{
					targetSelector = smelt.args[3];
					objective = smelt.args[4];
					var endString = operation + " " + mode + " " + targetSelector + " " + objective;
				}
			}

			//smelt.addCommandBlock(util.format('%s %s', startString, endString), {type:'chain',auto:true,conditional:conditionalState});
			smelt.addInitCommand((util.format('%s %s', startString, endString)));
		}
	}

module.exports = Stats;