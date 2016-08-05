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
		
		var callback_addCommandBlock = function(cmd, jsonOptions)
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
		
		var callback_addSupportModule = function(fileName)
		{
			var setupData = self.readPluginFile(name, fileName).toString().trim();
			fileParser.AddBangSetup({bangName:name, fileName: fileName, setupData: setupData});
		};

		var callback_setVariable = function(varName, varValue)
		{
			fileParser.setVariable(varName, varValue);
		}

		var callback_getVariable = function(varName)
		{
			return fileParser.getVariable(varName);
		}

		var smeltObj = 
		{
			settings : Settings.Current,
			args: args.slice(1),
			addCommandBlock: callback_addCommandBlock,
			addSupportModule: callback_addSupportModule,
			setVariable: callback_setVariable,
			getVariable: callback_getVariable
		};
		
		if(plugin.Install) plugin.Install(smeltObj);
		
		if(plugin.Execute)
		{
			plugin.Execute(smeltObj);
		}
		else
		{
			// For backwards compatibility:
			plugin(smeltObj.args, smeltObj.addCommandBlock, smeltObj.addSupportModule);
		}
		
		return commands;
	},
	loadPlugin : function(name)
	{
		var plugin = undefined;
		var pluginFound = false;
		var foundPath = "";

		var paths = [
			path.resolve(Program.LocalDirectory + "/.smelt/plugins/" + name + ".js"),
			path.resolve(Program.HomeDirectory + "/plugins/" + name + ".js"),
			path.resolve(Program.OcDirectory + "/plugins/" + name + ".js")
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
			path.resolve(Program.LocalDirectory + "/.smelt/plugins/" + filename),
			path.resolve(Program.HomeDirectory + "/plugins/" + filename),
			path.resolve(Program.OcDirectory + "/plugins/" + filename)
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
	},
	GetAllPlugins: function()
	{
		var plugins = [];
		
		var paths = [
			// path.resolve(Program.OcDirectory + "/plugins/"), - Don't include built in plugins
			path.resolve(Program.HomeDirectory + "/plugins/"),
			path.resolve(".smelt/plugins/")
		];

		paths.forEach(function(path)
		{	
			try 
			{
				var files = fs.readdirSync(path);
				files.forEach(function(file)
				{
					if(file.endsWith(".js"))
						plugins.push(path + ": " + file);
				});
			} 
			catch(err){}
		});

		return plugins;
	}
	
}

module.exports = BangCommandHelper;