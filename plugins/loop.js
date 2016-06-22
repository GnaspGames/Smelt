// ------------------
// --     loop     --
// ------------------
// Usage: !loop <loopName>

module.exports = function(args, addCommand, addSetup)
{
	var name = args[0];
	if(name)
	{
		addSetup("bang-commands-setup.mcc");
		addCommand("/testfor @e[type=ArmorStand,name=OC-SYSTEM,tag=loop_" + name + "]", {type:"repeating",auto:true,conditional:false});
		addCommand("searge", {type:"repeating",auto:true,conditional:true});
	}
}