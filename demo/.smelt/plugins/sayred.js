var util = require("util");

module.exports = function(smelt)
{			
	var message = smelt.args.join(" ");
	var command = "/tellraw @a [{\"text\":\"%s\",\"color\":\"red\"}]";
	smelt.addCommandBlock(util.format(command, message));
	smelt.addSupportModule("sayred-setup.mcc");
}