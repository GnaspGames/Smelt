// ------------------
// --     loop     --
// ------------------
// Usage: !loop <loopName>

var Test = {};

Test.Install = function(smelt)
{
	smelt.addSupportModule("bang-commands-setup.mcc");
};

Test.Execute = function(smelt)
{
	var input = smelt.args.join(" ");
	smelt.addCommandBlock("say Hello World", { type:"impulse", auto:true, conditional:false });
	smelt.addCommandBlock("say " + input, { type:"chain", auto:true, conditional:false });
	
	smelt.addVariable("$TestVariable", input);
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