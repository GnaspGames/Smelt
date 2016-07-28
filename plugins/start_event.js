// ------------------------
// --     start_event   --
// ------------------------
// Usage: !start_event <eventName>

module.exports = function(args, addCommand, addSetup)
{
	var name = args[0];
	if(name)
	{
		addSetup("bang-commands-setup.mcc");
		addCommand("/scoreboard players tag @e[type=ArmorStand,name=OC-SYSTEM] add event_" + name);
	}
}