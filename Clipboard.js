var spawn = require("child_process").spawn;

var Clipboard = {
	auto : function(data)
	{
		var arch = process.platform;
		
		if(!Clipboard.hasOwnProperty(arch))
			return; // just dont copy to clipboard if its not supported
			
		var cmd = Clipboard[arch].split(" ");
		var p = spawn(cmd[0], cmd.slice(1), {detached: true, stdio: [null, "ignore", "ignore"]});
		p.stdin.end(data);
		p.unref();
	},
	win32 : "clip",
	linux : "xclip -selection clipboard",
	darwin : "pbcopy"
};
module.exports = Clipboard;