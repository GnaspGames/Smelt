// -----------------------------
// --     reset_objective     --
// -----------------------------
// Usage: !reset_objective <objective> <criteria>

var ResetObjective = {}

ResetObjective.Install = function(smelt)
{
	// Nothing to install
};

ResetObjective.Execute = function(smelt)
{
	// Get name and criteria
	var name = smelt.args[0];
	var criteria = smelt.args[1];
	
	// Remove name and criteria from args.
	smelt.args.shift();
	smelt.args.shift();
	
	// Join the rest of args to get displayName
	var displayName = smelt.args.join(" ");

	if(name)
	{
		smelt.addCommandBlock("/scoreboard objectives remove " + name);
		smelt.addCommandBlock("/scoreboard objectives add " + name + " " + criteria + " " + displayName);
	}
};

module.exports = ResetObjective;