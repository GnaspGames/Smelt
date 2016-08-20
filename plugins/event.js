// ----------------------
// --     event     --
// ----------------------
// Usage: !event <eventName>

var Event =
{
	Install : function(smelt)
	{
		smelt.addSupportModule("bang-commands-setup.mcc");
	},
	
	Execute : function(smelt)
	{
		var name = smelt.args[0];
		if(name)
		{		
			smelt.addCommandBlock("scoreboard players tag @e[type=ArmorStand,name=OC-SYSTEM] remove event_" + name, {type:"repeating",auto:true,conditional:false});
			smelt.addCommandBlock("searge", {type:"repeating",auto:true,conditional:true});
		}
	}
}

module.exports = Event;