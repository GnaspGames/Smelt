// ----------------------
// --     stop_loop     --
// ----------------------
// Usage: !stop_loop <loopName>

var util = require("util");

var Loop = require("./loop.js");

var StopLoop = {}

StopLoop.Install = Loop.Install;

StopLoop.Execute = function(smelt)
{
	var name = smelt.args[0];
	if(name)
	{
		smelt.addCommandBlock(
				util.format("scoreboard players tag @e[tag=Smelt_SYSTEM] remove loop_%s", name)
			);
	}
};

module.exports = StopLoop;