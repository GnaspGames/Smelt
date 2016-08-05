var util = require("util");

module.exports = function(args, addCommandBlock)
{
	var entityTag = args[0];
	var objective = args[1];
	var axis = args[2];
	var max = parseInt(args[3]) || 32;
		
	var axisFormat = "~%d ~ ~";
	if(axis == "y")
		axisFormat = "~ ~%d ~";
	else if(axis == "z")
		axisFormat = "~ ~ ~%d";
		
	
	for(var i = max; i >= 1; i /= 2)
	{
		i = Math.ceil(i);
		
		addCommandBlock(util.format("tp @e[tag=%s,score_%s_min=%d] " + axisFormat, entityTag, objective, i, i));
		addCommandBlock(util.format("scoreboard players remove @e[tag=%s,score_%s_min=%d] %s %d", entityTag, objective, i, objective, i));
	}
};