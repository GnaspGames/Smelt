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
	if(name)
	{
		smelt.addCommandBlock(
			util.format("/scoreboard players tag @e[tag=Smelt_SYSTEM] add event_%s", name)
		);
	}
};

module.exports = StartEvent;