var util = require('util');
var fs = require('fs');

var Program = 
{
	PathArg : "",
	PathFound : false,
	Debug : false,
	OutputCommand : false,
	ProcessPath : function()
	{
		var stats = fs.statSync(this.PathArg);
	
		var files = [];
		
		if(stats.isFile())
			files.push(this.PathArg);
		
		else if(stats.isDirectory())
		{
			var fileNames = fs.readdirSync(this.PathArg);
			fileNames.forEach(function(fileName)
			{
				if(fileName.endsWith(".mcc")) 
					files.push(pathArg + fileName);
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