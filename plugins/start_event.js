// ------------------------
// --     start_event   --
// ------------------------
// Usage: !start_event <eventName>

var Event = require("./event.js");

var StartEvent = {}

StartEvent.Install = Event.Install;

StartEvent.Execute = function(smelt)
{
	var name = smelt.args[0];
	if(name)
	{
		smelt.addCommandBlock("/scoreboard players tag @e[type=ArmorStand,name=OC-SYSTEM] add event_" + name);
	}
}

module.exports = StartEvent;