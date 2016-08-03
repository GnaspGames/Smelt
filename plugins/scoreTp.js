var util = require("util");

module.exports = function(smelt)
{
	var entityTag = smelt.args[0];
	var objective = smelt.args[1];
	var axis = smelt.args[2];
	var max = parseInt(args[3]) || 32;
		
	var axisFormat = "~%d ~ ~";
	if(axis == "y")
		axisFormat = "~ ~%d ~";
	else if(axis == "z")
		axisFormat = "~ ~ ~%d";
		
	
	for(var i = max; i >= 1; i /= 2)
	{
		i = Math.ceil(i);
		
		smelt.addCommandBlock(util.format("tp @e[tag=%s,score_%s_min=%d] " + axisFormat, entityTag, objective, i, i));
		smelt.addCommandBlock(util.format("scoreboard players remove @e[tag=%s,score_%s_min=%d] %s %d", entityTag, objective, i, objective, i));
	}
};