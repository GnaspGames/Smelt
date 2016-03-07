#!/usr/bin/env node

var fs = require('fs');
var util = require('util');

var filePathArg = process.argv[2];

var debug = process.argv[3] == "debug" ? true : false;
var outputOneCommand = process.argv[3] == "output-command" ? true : false;

FileParser = require("./FileParser");

if(filePathArg)
{
	var stats = fs.statSync(filePathArg);
	
	var files = [];
	
	if(stats.isFile())
		files.push(filePathArg);
	
	else if(stats.isDirectory())
	{
		var fileNames = fs.readdirSync(filePathArg);
		fileNames.forEach(function(fileName)
		{
			if(fileName.endsWith(".mcc")) 
				files.push(filePathArg + fileName);
		});
	}
	
	files.forEach(function(filePath)
	{
		var fileParser = new FileParser();
		fileParser.Debug = debug
		fileParser.ProcessFile(filePath);
	});
}
else
{
	console.log("Please pass a filepath in as the first argument.")
}
