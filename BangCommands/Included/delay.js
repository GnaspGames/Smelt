/*
author: mrjvs
*/

var delay = {};


delay.Install = function (smelt) {
    smelt.addSupportModule("delay_support_module.mcc");
};

delay.HowTo = function () {
    var usage = "\n  Usage:\n\n  !delay ticks conditional command\n  Ticks, int: how many ticks delay it before the command runs.\n  Conditional, boolean: if the delay chain command block needs to be conditional or not.\n  Command, string: what command to delay.\n\n  Example: !delay 20 true /say hello there\n";
    return usage;
}

delay.Execute = function(smelt) {

    function makeid() {
        var text = "",
         possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        i = 0;
        for (i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        
        return text;
    }
        
    var markerId = makeid();
    var command = smelt.args[3];
    
    for (var i = 4; i < smelt.args.length; i++) {
        command += " " + smelt.args[i];
    }
    
    var options = {};
    options["type"] = "chain";
    options["auto"] = true;
    options["conditional"] = smelt.args[2];
    smelt.addCommandBlock("execute @e[tag=" + markerId + ",type=area_effect_cloud,c=1] ~ ~ ~ summon minecraft:area_effect_cloud ~ ~ ~ {Tags:[\"comDelay\"],Particle:\"take\",Age:-" + smelt.args[1] + "}", options);
    smelt.addCommandBlock(command,{auto:false,type:"impulse",conditional:false,markerTag:markerId});
    
    smelt.setJSON({markerTag:""});
    
}; 

module.exports = delay;