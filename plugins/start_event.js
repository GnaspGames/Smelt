// ------------------------
// --     start_event   --
// ------------------------
// Usage: !start_event <eventName>

module.exports = function(smelt)
{
	var name = smelt.args[0];
	if(name)
	{
		smelt.addSupportModule("bang-commands-setup.mcc");
		smelt.addCommandBlock("/scoreboard players tag @e[type=ArmorStand,name=OC-SYSTEM] add event_" + name);
	}
}