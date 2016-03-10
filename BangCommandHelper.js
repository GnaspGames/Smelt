var util = require('util');
var CommandCreator = require("./CommandCreator");

var BangCommandHelper = 
{
	
	processBang : function(bang)
	{
		var commands = []
		
		var args = bang.substr(1).split(" ");
		var name = args[0];
		var plugin = undefined;
		
		try
		{ 
			plugin = require("./plugins/" + name + ".js"); 
		}
		catch(err)
		{
			throw new Error(util.format("The command \"!%s\" could not be found. Did you forget to intall a plugin?", name)); 
		}
		
		plugin(args.slice(1), function(cmd, jsonOptions)
		{
			var _type = CommandCreator.type;
			var _conditional = CommandCreator.conditional;
			var _auto = CommandCreator.auto;
			var _executeAs = CommandCreator.executeAs;
			
			if(jsonOptions) CommandCreator.processJSONLine(jsonOptions);
			
			var command = CommandCreator.addSetblockCommand(cmd);
			commands.push(command);
			
			CommandCreator.type = _type;
			CommandCreator.type = _conditional;
			CommandCreator.type = _auto;
			CommandCreator.type = _executeAs;
		});
	
		return commands;
	}
}

module.exports = BangCommandHelper;