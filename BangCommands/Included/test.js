// ------------------
// --     loop     --
// ------------------
// Usage: !loop <loopName>

var Test = {};

Test.Install = function(smelt)
{
	switch(smelt.settings.Output.MinecraftVersion) 
	{
		case "1.9":
		case "1.10":
			smelt.addSupportModule("smelt-for-1.9.mcc");
			break;
		case "1.11":
    case "1.12":
     smelt.addSupportModule("smelt-for-1.11.mcc");
     break;
    case "1.13":
		default:
			smelt.addSupportModule("smelt-for-1.13.mcc");
			break;
	}
};

Test.Execute = function(smelt)
{
	var input = smelt.args.join(" ");
	smelt.addCommandBlock("say Hello World", { type:"impulse", auto:true, conditional:false });
	smelt.addCommandBlock("say " + input, { type:"chain", auto:true, conditional:false });

	var testInputVar = smelt.getVariable("$testInputVar");
	if(testInputVar)
	{
		if(smelt.settings.Output.ShowDebugInfo)
		{
			console.log("FOUND testInputVar!");
		}
		smelt.addCommandBlock("say testInputVar = " + testInputVar);
	}
	else
	{
		if(smelt.settings.Output.ShowDebugInfo)
		{
			console.log("DIDN'T FIND testInputVar! Value:" + testInputVar);
		}
	}

	smelt.setVariable("$testOutputVar", input);
};

/*

IDEAS:

Test.Help = function(smelt)
{
	smelt.addHelpUsage("!loop <loopName>");
	smelt.addHelpDescription("Used to define commands to be run on a loop; use with !start_loop and !stop_loop");
}

*/

module.exports = Test;