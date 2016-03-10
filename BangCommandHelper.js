var util = require('util');
var CommandCreator = require("./CommandCreator");

var BangCommandHelper = 
{
	ProcessBang : function(bang, fileParser)
	{
		var commands = []
		
		var args = bang.substr(1).split(" ");
		var name = args[0];
		var plugin = this.loadPlugin(name);
		
		var commandCallback = function(cmd, jsonOptions)
		{
			var _type = CommandCreator.type;
			var _conditional = CommandCreator.conditional;
			var _auto = CommandCreator.auto;
			var _executeAs = CommandCreator.executeAs;
			
			if(jsonOptions) CommandCreator.processJSONLine(jsonOptions);
			
			var command = CommandCreator.addSetblockCommand(cmd);
			commands.push(command);
			
			CommandCreator.type = _type;
			CommandCreator.conditional = _conditional;
			CommandCreator.auto = _auto;
			CommandCreator.executeAs = _executeAs;
		};
		
		var setupCallback = function(setupData)
		{
			fileParser.BangSetups.push({bang:name, data: setupData});
		};
		
		plugin(args.slice(1), commandCallback, setupCallback);
		
		return commands;
	},
	loadPlugin : function(name)
	{
		var plugin = undefined;
		var pluginFound = false;
		try
		{ 
			plugin = require("./plugins/" + name + ".js"); 
			pluginFound = true;
		}
		catch(err){}
		
		try
		{ 
			if(!pluginFound)
			{
				plugin = require("../oc-plugins/oc-" + name + "/index.js"); 
				pluginFound = true;
			}
		}
		catch(err){}	
		
		if(!pluginFound) throw new Error(util.format("The command \"!%s\" could not be found. Did you forget to intall a plugin?", name)); 
		
		return plugin;
	}
	
}

module.exports = BangCommandHelper;