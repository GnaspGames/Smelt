var util = require('util');
var fs = require('fs');
var _path = require('path');

var Program = 
{
	PathArg : "",
	Path : "",
	PathFound : false,
	Debug : false,
	OutputCommand : false,
	ProcessPath : function()
	{
		Program.Path = _path.resolve(this.PathArg);
		var stats = fs.statSync(Program.Path);
	
		var files = [];
		
		if(stats.isFile())
			files.push(Program.Path);
		
		else if(stats.isDirectory())
		{
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