var util = require("util");

module.exports = function(args, addCommand, addSetup)
{			
	addSetup("helloworld-setup.mcc");		
	addCommand("/say Hello World!", {"type":"impulse","auto":true});
	addCommand("/say Hello World 2!", {"type":"chain","auto":true});
	addCommand("/say Hello World 3!");
}