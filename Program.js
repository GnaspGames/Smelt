var _path = require('path');
var os = require('os');

var Program = 
{
	LocalDirectory : "",
	HomeDirectory: os.homedir() + "/.smelt",
	OcDirectory: __dirname
}

module.exports = Program;