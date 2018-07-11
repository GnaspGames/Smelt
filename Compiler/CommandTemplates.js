var Settings = require("../Configuration/Settings");
var util = require ("util");

var Templates = 
{
	Current : null,
    MC_1_13: {
        formatExec: function (execAs,cmd) {
            return util.format("/execute as %s run %s",execAs,cmd);
        },
        formatSetblock: function (x,y,z,blockName,dataValue,cxx,cmd,autoString,trackOutputString) {
       return util.format(this.SETBLOCK_COMMAND_FORMAT,x,y,z,blockName, dataValue,cxx,cmd,autoString, trackOutputString);
},
        IMPULSE_BLOCK_NAME : "command_block",
		REPEATING_BLOCK_NAME : "repeating_command_block",
		CHAIN_BLOCK_NAME : "chain_command_block",
		TESTFORBLOCK_COMMAND_FORMAT: "testforblock ~%d ~%d ~%d minecraft:%s -1 {SuccessCount:0}",
		SETBLOCK_COMMAND_FORMAT : "setblock ~%d ~%d ~%d %s[facing=%s,conditional=%s]{Command:%s%s%s} replace",
		SUMMON_ARMORSTAND_DISPLAY_MARKER_FORMAT : "summon minecraft:armor_stand ~%d ~%d ~%d {CustomName:\"{\\\"text\\\":\\\"%s\\\"}\", Tags:[\"oc_marker\"], Marker:1b, CustomNameVisible:1b, Invulnerable:1b, NoGravity:1b, Invisible:1b}",
		SUMMON_ARMORSTAND_CMD_MARKER_FORMAT : "summon minecraft:armor_stand ~%d ~%d ~%d {Tags:[\"oc_marker\",\"%s\"], Marker:1b, Invulnerable:1b, NoGravity:1b}",	
		SUMMON_AEC_DISPLAY_MARKER_FORMAT : "summon minecraft:area_effect_cloud ~%d ~%d ~%d {CustomName:{\"{\\\"text\\\":\\\"%s\\\"}\", CustomNameVisible:1b, Tags:[\"oc_marker\"], Duration:2147483647}",
		SUMMON_AEC_CMD_MARKER_FORMAT : "summon minecraft:area_effect_cloud ~%d ~%d ~%d {Tags:[\"oc_marker\",\"%s\"], Duration:2147483647}",
		SUMMON_REBUILD_ENTITY : "summon minecraft:armor_stand ~%d ~%d ~%d {Tags:[\"oc_rebuild\"]}",
		CLEAR_AREA_FORMAT: "execute as @e[tag=oc_rebuild] run fill ~%d ~%d ~%d ~%d ~%d ~%d minecraft:air hollow",
		CLEAR_MARKERS_FORMAT: "execute as @e[tag=oc_rebuild] run kill @e[tag=oc_marker,dx=%d,dy=%d,dz=%d]",
		CLEAR_MODULE_DISPLAY_MARKER: "kill @e[tag=oc_marker,distance=0]",
		CLEAR_REBUILD_ENTITY: "kill @e[tag=oc_rebuild]",
		CLEAR_MINECARTS: "kill @e[type=command_block_minecart,distance=0]",
		COMMAND_BLOCK_MINECART_NBT_FORMAT: "{Time:1,id:command_block_minecart,BlockState:{Name:command_block},Command:%s}",
		SUMMON_FALLING_RAIL_FORMAT: "summon minecraft:falling_block ~ ~5 ~ {BlockState:{Name:activator_rail},Time:1,Passengers:[%s]}"
    }
}

var getCurrent = function()
{
	var current = Templates.MC_1_13;
	return current;
}

Templates.Current = getCurrent();

module.exports = Templates;
