// ------------------
// --     loop     --
// ------------------
// Usage: !loop <loopName>

module.exports = function(smelt)
{
	var name = smelt.args[0];
	if(name)
	{
		smelt.addSupportModule("bang-commands-setup.mcc");
		smelt.addCommandBlock("/testfor @e[type=ArmorStand,name=OC-SYSTEM,tag=loop_" + name + "]", {type:"repeating",auto:true,conditional:false});
		smelt.addCommandBlock("searge", {type:"repeating",auto:true,conditional:true});
	}
}