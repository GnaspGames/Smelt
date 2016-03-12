var util = require("util");

module.exports = function(args, addCommand, addSetup)
{			
	var message = args.join(" ");
	var command = "/tellraw @a [{\"text\":\"%s\",\"color\":\"red\"}]";
	addCommand(util.format(command, message));
	addSetup("sayred-setup.mcc");
}