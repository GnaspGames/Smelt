/*
	Author: mrjvs
	Edited by: Gnasp
*/

var util = require("util");

var delay = {};

function makeUniqueId()
{
	var text = "",
		possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		i = 0;
	for (i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

delay.Install = function (smelt)
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
		default:
			smelt.addSupportModule("smelt-for-1.13.mcc");
			break;
	}
};

delay.HowTo = function ()
{
	var usage = "\n " +
		"  Usage:\n\n" +
		"  !delay ticks conditional command\n" +
		"  Ticks, int: how many ticks delay it before the command runs.\n" +
		"  Conditional, boolean: if the delay chain command block needs to be conditional or not.\n" +
		"  Command, string: what command to delay.\n\n" +
		"  Example: !delay 20 true /say hello there\n";
	return usage;
}

delay.Execute = function (smelt)
{
	// Get ticks and conditional
	var waitForTicks = smelt.args[0];
	var useConditional = smelt.args[1];
	
	// Remove ticks and conditional from args.
	smelt.args.shift();
	smelt.args.shift();
	
	// Join the rest of args to get command
	var command = smelt.args.join(" ");

	// Generate unique id for marker entity
	var markerId = makeUniqueId();

	var summonFormat = "";
	switch(smelt.settings.Output.MinecraftVersion) 
	{
		case "1.9":
		case "1.10":
			summonFormat = "execute @e[tag=%s,type=AreaEffectCloud,c=1] ~ ~ ~ summon minecraft:AreaEffectCloud ~ ~ ~ {Tags:[\"aecDelay\"],Particle:\"take\",Age:-%s}";
			break;
    case "1.11":
    case "1.12":
      summonFormat = "execute @e[tag=%s,type=area_effect_cloud,c=1] ~ ~ ~ summon minecraft:area_effect_cloud ~ ~ ~ {Tags:[\"aecDelay\"],Particle:\"take\",Age:-%s}";
			break;
		case "1.13":
		default:
			summonFormat = "execute as @e[tag=%s,type=area_effect_cloud,c=1] run summon minecraft:area_effect_cloud ~ ~ ~ {Tags:[\"aecDelay\"],Particle:\"take\",Age:-%s}";
			break;
	}

	// Generate summon command that will assume markerId entity exists and will summon an aecDelay at that location.
	// TODO: Remove this when we can get the NEXT command block location instea. Then just summon aecDelay.
	var summonCommand = util.format(summonFormat, markerId, waitForTicks);

	// Create chain block with summon command
	smelt.addCommandBlock(summonCommand, { type: "chain", auto: true, conditional: useConditional });
	
	// Create impulse block with markerId entity inside it.
	smelt.addCommandBlock(command, { type: "impulse", auto: false, conditional: false, markerTag: markerId });
};

module.exports = delay;
