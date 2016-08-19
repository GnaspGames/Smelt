var Settings = require("../Settings");

var Templates = 
{
	Current : null,
	MC_1_9 : 
	{
		IMPULSE_BLOCK_NAME : "command_block",
		REPEATING_BLOCK_NAME : "repeating_command_block",
		CHAIN_BLOCK_NAME : "chain_command_block",
		TESTFORBLOCK_COMMAND_FORMAT: "testforblock ~%d ~%d ~%d minecraft:%s -1 {SuccessCount:1}",
		SETBLOCK_COMMAND_FORMAT : "setblock ~%d ~%d ~%d %s %d replace {Command:%s%s}",
		SUMMON_ARMORSTAND_DISPLAY_MARKER_FORMAT : "summon ArmorStand ~ ~ ~%d {CustomName:%s, Tags:[\"oc_marker\"], Marker:1b, CustomNameVisible:1b, Invulnerable:1b, NoGravity:1b, Invisible:1b}",
		SUMMON_ARMORSTAND_CMD_MARKER_FORMAT : "summon ArmorStand ~%d ~%d ~%d {Tags:[\"oc_marker\",\"%s\"], Marker:1b, Invulnerable:1b, NoGravity:1b}",	
		SUMMON_AEC_DISPLAY_MARKER_FORMAT : "summon AreaEffectCloud ~ ~ ~%d {CustomName:%s, CustomNameVisible:1b, Tags:[\"oc_marker\"], Duration:2147483647}",
		SUMMON_AEC_CMD_MARKER_FORMAT : "summon AreaEffectCloud ~%d ~%d ~%d {Tags:[\"oc_marker\",\"%s\"], Duration:2147483647}",
		SUMMON_REBUILD_ENTITY : "summon ArmorStand ~ ~-1 ~ {Tags:[\"oc_rebuild\",\"oc_marker\"]}",
		CLEAR_AREA_FORMAT: "execute @e[tag=oc_rebuild] ~ ~ ~ fill ~%d ~%d ~%d ~%d ~%d ~%d air 0",
		CLEAR_MARKERS_FORMAT: "execute @e[tag=oc_rebuild] ~ ~ ~ kill @e[tag=oc_marker,dx=%d,dy=%d,dz=%d]",
		CLEAR_MINECARTS: "kill @e[type=MinecartCommandBlock,r=0]",
		COMMAND_BLOCK_MINECART_NBT_FORMAT: "{id:MinecartCommandBlock,Command:%s}",
		SUMMON_FALLING_RAIL_FORMAT: "summon FallingSand ~ ~5 ~ {Block:activator_rail,Time:1,Passengers:[%s]}"
	},
	MC_1_11 : 
	{
		IMPULSE_BLOCK_NAME : "command_block",
		REPEATING_BLOCK_NAME : "repeating_command_block",
		CHAIN_BLOCK_NAME : "chain_command_block",
		TESTFORBLOCK_COMMAND_FORMAT: "testforblock ~%d ~%d ~%d minecraft:%s -1 {SuccessCount:1}",
		SETBLOCK_COMMAND_FORMAT : "setblock ~%d ~%d ~%d %s %d replace {Command:%s%s}",
		SUMMON_ARMORSTAND_DISPLAY_MARKER_FORMAT : "summon minecraft:armor_stand ~ ~ ~%d {CustomName:%s, Tags:[\"oc_marker\"], Marker:1b, CustomNameVisible:1b, Invulnerable:1b, NoGravity:1b, Invisible:1b}",
		SUMMON_ARMORSTAND_CMD_MARKER_FORMAT : "summon minecraft:armor_stand ~%d ~%d ~%d {Tags:[\"oc_marker\",\"%s\"], Marker:1b, Invulnerable:1b, NoGravity:1b}",	
		SUMMON_AEC_DISPLAY_MARKER_FORMAT : "summon minecraft:area_effect_cloud ~ ~ ~%d {CustomName:%s, CustomNameVisible:1b, Tags:[\"oc_marker\"], Duration:2147483647}",
		SUMMON_AEC_CMD_MARKER_FORMAT : "summon minecraft:area_effect_cloud ~%d ~%d ~%d {Tags:[\"oc_marker\",\"%s\"], Duration:2147483647}",
		SUMMON_REBUILD_ENTITY : "summon minecraft:armor_stand ~ ~-1 ~ {Tags:[\"oc_rebuild\",\"oc_marker\"]}",
		CLEAR_AREA_FORMAT: "execute @e[tag=oc_rebuild] ~ ~ ~ fill ~%d ~%d ~%d ~%d ~%d ~%d air 0",
		CLEAR_MARKERS_FORMAT: "execute @e[tag=oc_rebuild] ~ ~ ~ kill @e[tag=oc_marker,dx=%d,dy=%d,dz=%d]",
		CLEAR_MINECARTS: "kill @e[type=commandblock_minecart,r=0]",
		COMMAND_BLOCK_MINECART_NBT_FORMAT: "{id:commandblock_minecart,Command:%s}",
		SUMMON_FALLING_RAIL_FORMAT: "summon minecraft:falling_block ~ ~5 ~ {Block:activator_rail,Time:1,Passengers:[%s]}"
	}
}

var getCurrent = function()
{
	var current = Templates.MC_1_9; //Default value
	switch (Settings.Current.Output.MinecraftVersion) 
	{
		case "1.9":
		case "1.10":
			current = Templates.MC_1_9;
			break;
		case "1.11":
		default:
			current = Templates.MC_1_11;
			break;
	}
	return current;
}

Templates.Current = getCurrent();

module.exports = Templates;