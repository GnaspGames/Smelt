var util = require("util");

var SayRed = {};

SayRed.Install = function(smelt)
{
	smelt.addSupportModule("sayred-setup.mcc");
};

SayRed.Execute = function(smelt)
{
	var message = smelt.args.join(" ");
	var command = "/tellraw @a [{\"text\":\"%s\",\"color\":\"red\"}]";
	smelt.addCommandBlock(util.format(command, message));
};

module.exports = SayRed;