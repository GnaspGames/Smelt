var Pre =
{
	Execute : function(smelt)
	{
		var cmd = smelt.args.join(" ");
		smelt.addInitCommand(cmd);
	}
}

module.exports = Pre;
