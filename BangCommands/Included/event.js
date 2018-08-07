// ----------------------
// --     event     --
// ----------------------
// Usage: !event <eventName>

var util = require("util");

var Event =
{
	Install : function(smelt)
	{
		switch(smelt.settings.Output.MinecraftVersion) 
		{
			case "1.9":
			case "1.10":
				smelt.addSupportModule("smelt-for-1.9.mcc");
				break;
			case "1.11":
      case "1.12":
        smelt.addSupportModule("smelt-for-1.11.mcc");
        break;
      case "1.13":
			default:
				smelt.addSupportModule("smelt-for-1.13.mcc");
				break;
		}
	},
	Execute : function(smelt)
	{
		var name = smelt.args[0];
    var tag = "tag";
    if (smelt.settings.Output.MinecraftVersion == "1.9" || smelt.settings.Output.MinecraftVersion == "1.10" || smelt.settings.Output.MinecraftVersion == "1.11" || smelt.settings.Output.MinecraftVersion == "1.12"){
      tag = "scoreboard players tag"; }
		if(name)
		{
			smelt.addCommandBlock(
				util.format("%s @e[tag=Smelt_SYSTEM] remove event_%s", tag,name), 
				{type:"repeating",auto:true,conditional:false}
			);
			
			smelt.addCommandBlock(
				"searge", 
				{type:"repeating",auto:true,conditional:true}
			);
		}
	}
}

module.exports = Event;