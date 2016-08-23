// ----------------------
// --     start_loop     --
// ----------------------
// Usage: !start_loop <loopName>

var util = require("util");

var Loop = require("./loop.js");

var StartLoop = {}

StartLoop.Install = Loop.Install;

StartLoop.Execute = function(smelt)
{
	var name = smelt.args[0];
	if(name)
	{
		smelt.addCommandBlock(
			util.format("/scoreboard players tag @e[tag=Smelt_SYSTEM] add loop_%s", name)
		);
	}
};

module.exports = StartLoop;