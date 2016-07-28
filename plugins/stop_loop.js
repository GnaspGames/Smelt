// ----------------------
// --     stop_loop     --
// ----------------------
// Usage: !stop_loop <loopName>

module.exports = function(args, addCommand, addSetup)
{
	var name = args[0];
	if(name)
	{
		addSetup("bang-commands-setup.mcc");
		addCommand("/scoreboard players tag @e[type=ArmorStand,name=OC-SYSTEM] remove loop_" + name);
	}
}