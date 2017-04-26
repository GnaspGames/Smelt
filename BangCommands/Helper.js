var util = require('util');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var Paths = require("../Tools/Paths");

var BangCommandHelper = 
{
	ProcessBang : function(commandModule, bang, fileParser)
	{
		var commands = []
		
		var args = bang.substr(1).split(" ");
		var name = args[0];
		var plugin = this.loadPlugin(name);
		var self = this;
		
		var callback_addCommandBlock = function(cmd, jsonOptions)
		{
			var _type = CommandCreator.currentCommandBlock.type;
			var _conditional = CommandCreator.currentCommandBlock.conditional;
			var _auto = CommandCreator.currentCommandBlock.auto;
			var _executeAs = CommandCreator.executeAs;
			var _markerTag = CommandCreator.markerTag;
			
			if(jsonOptions) CommandCreator.processJSONLine(jsonOptions);
			
			var cornerCommands = CommandCreator.fixConditionalCorners();
			if(cornerCommands.length > 0)
			{
				for(var i in cornerCommands)
				{	
					var cornerCmd = cornerCommands[i];
					commands.push(cornerCmd);
				}
			}
			
			var summon = CommandCreator.addNewCmdMarker();
			if(summon) commands.push(summon);
			
			var command = CommandCreator.addSetblockCommand(cmd);
			commands.push(command);
			
			if(_type == "impulse-chain" || _type == "repeating-chain")
			{
				_type = "chain";
			}
			
			CommandCreator.currentCommandBlock.type = _type;
			CommandCreator.currentCommandBlock.conditional = _conditional;
			CommandCreator.currentCommandBlock.auto = _auto;
			CommandCreator.executeAs = _executeAs;
			CommandCreator.markerTag = _markerTag;
		};
		
		var callback_addInitCommand = function(cmd)
		{
			commands.push(cmd);
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
			getPreviousCommandBlock : function(){ return CommandCreator.previousCommandBlock; },
			getCurrentCommandBlock : function(){ return CommandCreator.currentCommandBlock; },
			addCommandBlock: callback_addCommandBlock,
			addInitCommand: callback_addInitCommand,
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
			path.resolve(Paths.LocalDirectory + "/.smelt/plugins/" + name + ".js"),
			path.resolve(Paths.HomeDirectory + "/plugins/" + name + ".js"),
			path.resolve(Paths.OcDirectory + "/BangCommands/Included/" + name + ".js")
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
			path.resolve(Paths.LocalDirectory + "/.smelt/plugins/" + filename),
			path.resolve(Paths.HomeDirectory + "/plugins/" + filename),
			path.resolve(Paths.OcDirectory + "/BangCommands/Included/" + filename)
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
		
		if(!pluginFound) throw new Error(util.format("The file \"!%s\" could not be found. Are you missing a plugin file?", filename)); 
		
		return fileData;
	},
	GetAllPlugins: function()
	{
		var plugins = [];
		
		var paths = [
			// path.resolve(Paths.OcDirectory + "/BangCommands/Included/"), - Don't include built in plugins
			path.resolve(Paths.HomeDirectory + "/plugins/"),
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
	},
	IsSupportModuleInCache : function(supportModule)
	{
		// assume false by default.
		var inCache = false;
		// Path to the cache file
		var cacheFile = path.resolve(Paths.LocalDirectory + "/.smelt/cache/support-modules.txt");

		// Only continue of the cache file exists
		if(fs.existsSync(cacheFile))
		{
			// Hash the support module data to compare with cache
			var md5sum = crypto.createHash('md5');
			md5sum.update(supportModule.setupData);
			var digest = md5sum.digest('hex');
			
			// Load the cache file and loop through the lines in the file.
			// Each line of the file should be a hash digest
			var cacheData = fs.readFileSync(cacheFile).toString();
			var lines = cacheData.split("\n");
			lines.forEach(function(line)
			{
				if(line == digest)
				{
					// If the line matches the digest, then return true.
					// This file has been installed before.
					inCache = true;
				}
			});
		}
		
		return inCache;
	},
	AddSupportModuleToCache : function(supportModule)
	{
		// Path to the cache file
		var cacheFile = path.resolve(Paths.LocalDirectory + "/.smelt/cache/support-modules.txt");

		// Hash the support module data to add to cache
		var md5sum = crypto.createHash('md5');
		md5sum.update(supportModule.setupData);
		var digest = md5sum.digest('hex');

		// Create the directory if it doesn't exist
		var saveDir = path.dirname(cacheFile);
		if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);

		// Add digest to cache file as new line.
		fs.appendFileSync(cacheFile, digest + "\n");
	}
}

module.exports = BangCommandHelper;
