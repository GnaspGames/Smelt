var _path = require('path');
var os = require('os');

var Paths = 
{
	LocalDirectory : "",
	HomeDirectory: os.homedir() + "/.smelt",
	OcDirectory: _path.dirname(__dirname)
}

module.exports = Paths;