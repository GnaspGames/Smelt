// ------------------
// --     loop     --
// ------------------
// Usage: !loop <loopName>

var util = require("util");

var Loop = 
{
	Install: function(smelt)
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
	Execute: function(smelt)
	{
		var name = smelt.args[0];
		if(name)
		{
			smelt.addCommandBlock(
				util.format("execute if entity @e[tag=Smelt_SYSTEM,nbt={Tags:[\"loop_%s\"]}] run searge", name), 
				{type:"repeating",auto:true,conditional:false}
			);
		}
	}
}

module.exports = Loop;