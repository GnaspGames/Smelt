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
   var tag = "tag";
    if (smelt.settings.Output.MinecraftVersion == "1.9" || smelt.settings.Output.MinecraftVersion == "1.10" || smelt.settings.Output.MinecraftVersion == "1.11" || smelt.settings.Output.MinecraftVersion == "1.12"){
      tag = "scoreboard players tag"; }
	if(name)
	{
		smelt.addCommandBlock(
			util.format("/%s @e[tag=Smelt_SYSTEM] add loop_%s", tag, name)
		);
	}
};

module.exports = StartLoop;