// ------------------
// --     init     --
// ------------------
// Usage: !init <command>

var Init =
{
	Execute : function(smelt)
	{
		// Join all arguments passed into one string (the command to be run)
		var cmd = smelt.args.join(" "); 
		smelt.addInitCommand(cmd);
	}
}

module.exports = Init;
