var util = require('util');
var fs = require('fs');
var _path = require('path');
var chalk = require('chalk');

var Program = 
{
	PathArg : "",
	Path : "",
	Directory : "",
	PathFound : false,
	SingleFile : true,
	Debug : false,
	OutputCommand : false,
	Copy: false,
	ProcessPath : function()
	{
		Program.Path = _path.resolve(this.PathArg);
		var stats = fs.statSync(Program.Path);
	
		var files = [];
		
		if(stats.isFile())
		{
			Program.Directory = _path.dirname(Program.Path);
			files.push(Program.Path);
		}
		else if(stats.isDirectory())
		{
			Program.SingleFile = false;
			Program.Directory = Program.Path;
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