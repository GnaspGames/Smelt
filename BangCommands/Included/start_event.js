// ------------------------
// --     start_event   --
// ------------------------
// Usage: !start_event <eventName>

var util = require("util");

var Event = require("./event.js");

var StartEvent = {}

StartEvent.Install = Event.Install;

StartEvent.Execute = function(smelt)
{
	var name = smelt.args[0];
   var tag = "tag";
    if (smelt.settings.Output.MinecraftVersion == "1.9" || smelt.settings.Output.MinecraftVersion == "1.10" || smelt.settings.Output.MinecraftVersion == "1.11" || smelt.settings.Output.MinecraftVersion == "1.12"){
      tag = "scoreboard players tag"; }

	if(name)
	{
		smelt.addCommandBlock(
			util.format("/%s @e[tag=Smelt_SYSTEM] add event_%s",tag, name)
		);
	}
};

module.exports = StartEvent;