// ----------------------
// --     event     --
// ----------------------
// Usage: !event <eventName>

module.exports = function(args, addCommand, addSetup)
{
	var name = args[0];
	if(name)
	{
		addSetup("bang-commands-setup.mcc");	
		addCommand("/scoreboard players tag @e[type=ArmorStand,name=OC-SYSTEM] remove event_" + name, {type:"repeating",auto:true,conditional:false});
		addCommand("searge", {type:"repeating",auto:true,conditional:true});
	}
}