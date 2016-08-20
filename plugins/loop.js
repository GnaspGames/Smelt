// ------------------
// --     loop     --
// ------------------
// Usage: !loop <loopName>

var Loop = 
{
	Execute: function(smelt)
	{
		var name = smelt.args[0];
		if(name)
		{
			smelt.addCommandBlock("/testfor @e[type=ArmorStand,name=OC-SYSTEM,tag=loop_" + name + "]", {type:"repeating",auto:true,conditional:false});
			smelt.addCommandBlock("searge", {type:"repeating",auto:true,conditional:true});
		}
	},

	Install: function(smelt)
	{
		smelt.addSupportModule("bang-commands-setup.mcc");
	}
}

module.exports = Loop;