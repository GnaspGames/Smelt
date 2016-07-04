var util = require('util');
var fs = require('fs');
var _path = require('path');
var chalk = require('chalk');
var os = require('os');

var Program = 
{
	PathArg : "",
	Path : "",
	LocalDirectory : "",
	HomeDirectory: os.homedir() + "/.smelt",
	OcDirectory: __dirname,
	PathFound : false,
	ProcessPath : function()
	{
		Program.Path = _path.resolve(this.PathArg);
		var stats = fs.statSync(Program.Path);
	
		var files = [];
		
		if(stats.isFile())
		{
			Program.LocalDirectory = _path.dirname(Program.Path);
			files.push(Program.Path);
		}
		else if(stats.isDirectory())
		{
			Program.LocalDirectory = Program.Path;
			var fileNames = fs.readdirSync(Program.Path);
			fileNames.forEach(function(fileName)
			{
				if(fileName.endsWith(".mcc")) 
					files.push(Program.Path + "\\" + fileName);
			});
		}
		
		files.forEach(function(filePath)
		{
			var fileParser = new FileParser();
			fileParser.ProcessFile(filePath);
			Program.PathFound = true;
		});
	}
}

module.exports = Program;