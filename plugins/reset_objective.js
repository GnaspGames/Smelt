// -----------------------------
// --     reset_objective     --
// -----------------------------
// Usage: !reset_objective <objective> <criteria>


module.exports = function(args, addCommand, addSetup)
{
	var name = args[0];
	var criteria = args[1];
	args.shift();
	args.shift();
	var displayName = args.join(" ");
	if(name)
	{
		addCommand("/scoreboard objectives remove " + name);
		addCommand("/scoreboard objectives add " + name + " " + criteria + " " + displayName);
	}
}