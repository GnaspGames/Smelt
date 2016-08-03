// ----------------------
// --     event     --
// ----------------------
// Usage: !event <eventName>

module.exports = function(smelt)
{
	var name = smelt.args[0];
	if(name)
	{
		smelt.addSupportModule("bang-commands-setup.mcc");	
		smelt.addCommandBlock("scoreboard players tag @e[type=ArmorStand,name=OC-SYSTEM] remove event_" + name, {type:"repeating",auto:true,conditional:false});
		smelt.addCommandBlock("searge", {type:"repeating",auto:true,conditional:true});
	}
}