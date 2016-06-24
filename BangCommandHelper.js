var util = require('util');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var CommandCreator = require("./CommandCreator");
var Program = require("./Program");
var Settings = require("./Settings");

var BangCommandHelper = 
{
	ProcessBang : function(bang, fileParser)
	{
		var commands = []
		
		var args = bang.substr(1).split(" ");
		var name = args[0];
		var plugin = this.loadPlugin(name);
		var self = this;
		
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
		
		var setupCallback = function(fileName)
		{
			var setupData = self.readPluginFile(name, fileName).toString().trim();
			fileParser.AddBangSetup({bangName:name, fileName: fileName, setupData: setupData});
		};
		
		plugin(args.slice(1), commandCallback, setupCallback);
		
		return commands;
	},
	loadPlugin : function(name)
	{
		var plugin = undefined;
		var pluginFound = false;
		var foundPath = "";
		
		var paths = [
			path.resolve(Program.Directory + "/oc-plugins/" + name + ".js"),
			"./plugins/" + name + ".js"
		];
		
		if(Settings.Current.Output.ShowDebugInfo) console.log("  Checking for plugins:");
		
		paths.forEach(function(path)
		{
			try
			{ 
				if(Settings.Current.Output.ShowDebugInfo) console.log("  Checking: " + path);
				if(!pluginFound)
				{
					var fullpath = require.resolve(path);
					plugin = require(fullpath); 
					pluginFound = true;
					foundPath = path;
				}
			}
			catch(err)
			{
				if(Settings.Current.Output.ShowDebugInfo) console.log(chalk.red.bold("    " + err));
			}
		});
		
		if(Settings.Current.Output.ShowDebugInfo && pluginFound) console.log(chalk.green.bold("  FOUND: " + foundPath));
		
		if(!pluginFound) throw new Error(util.format("The command \"!%s\" could not be found. Did you forget to intall a plugin?", name)); 
		
		return plugin;
	},
	readPluginFile: function(pluginName, filename)
	{
		var pluginFileFound = false;
		var fileData = undefined;
		var paths = [
			path.resolve(Program.Directory + "/oc-plugins/" + filename),
			"./plugins/" + filename
		];
		
		paths.forEach(function(path)
		{
			try
			{ 
				if(!pluginFileFound)
				{
					var fullpath = require.resolve(path);
					fileData = fs.readFileSync(fullpath);
					pluginFound = true;
				}
			}
			catch(err){}
		});
		
		if(!pluginFound) throw new Error(util.format("The setup file \"!%s\" could not be found. Are you missing a plugin file?", filename)); 
		
		return fileData;
	}
	
}

module.exports = BangCommandHelper;