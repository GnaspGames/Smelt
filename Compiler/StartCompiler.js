var fs = require('fs');
var _path = require('path');
var chalk = require('chalk');
var os = require('os');
var watch = require('node-watch');

var Paths = require("../Tools/Paths");

var StartCompiler = 
{
	PathArg : "",
	Path : "",
	PathFound : false,
	Watch: false,
	Watcher: null,
	ProcessPath : function()
	{
		StartCompiler.Path = _path.resolve(StartCompiler.PathArg);
		var stats = fs.statSync(StartCompiler.Path);
	
		var files = [];
		
		if(stats.isFile())
		{
			Paths.LocalDirectory = _path.dirname(StartCompiler.Path);
			var fileName = StartCompiler.Path;
			if(fileName.endsWith(".mcc")) 
				files.push(fileName);
		}
		else if(stats.isDirectory())
		{
			Paths.LocalDirectory = StartCompiler.Path;
			var fileNames = fs.readdirSync(StartCompiler.Path);
			fileNames.forEach(function(fileName)
			{
				if(fileName.endsWith(".mcc")) 
					files.push(StartCompiler.Path + "\\" + fileName);
			});
		}
		
		files.forEach(function(filePath)
		{
			var fileParser = new FileParser();
			fileParser.ProcessFile(filePath);
			StartCompiler.PathFound = true;
		});

		if(StartCompiler.Watch)
		{
			var rl = require("readline").createInterface(
			{
				input: process.stdin,
				output: process.stdout
			});
			
			console.log(chalk.white("\nWatching: " + StartCompiler.Path));
			console.log(chalk.grey("Use <ctrl>-C to stop watching."));
			
			StartCompiler.Watcher = watch(StartCompiler.Path);

			StartCompiler.Watcher.on('change', function(file)
			{
				if(file.endsWith(".mcc")) 
				{
					file = _path.resolve(file);
					console.log(chalk.white('\nChanged: ' + file + " at " + new Date().toLocaleTimeString()));
					var fileParser = new FileParser();
					fileParser.ProcessFile(file);
				}
			});

			rl.on("SIGINT", function()
			{
				console.log(chalk.grey("\nExiting...\n"));
				StartCompiler.Watcher.close();
				process.exit();
			});
		}

	}
}

module.exports = StartCompiler;