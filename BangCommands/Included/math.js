/*	__  __    _    ____ ___ ____ 
--	|  \/  |  / \  / ___|_ _/ ___|
--	| |\/| | / _ \| |  _ | | |    
--	| |  | |/ ___ \ |_| || | |___ 
--	|_|  |_/_/   \_\____|___\____|
--	!math random.seed = (random.seed * 214013 + 2531011) % (32768 - 1 + 1)
*/

var precendence = {
	"(": 1,
	")": 1,
	
	"+": 2,
	"-": 2,
	
	"*": 3,
	"/": 3,
	"%": 3
};

var compileTimeOps = {
	"+": function(a, b) { return a + b; },
	"-": function(a, b) { return a - b; },
	"*": function(a, b) { return a * b; },
	"/": function(a, b) { return a / b; },
	"%": function(a, b) { return a % b; },
}

var Math = {};
var statics;

Math.Execute = function(smelt)
{
	var result = smelt.args[0];
	var resultOp = smelt.args[1];
	var formula = smelt.args.slice(2).join(" ");
	
	if(result.indexOf(".") < 1 || !/^[\+\-\*\/%]?=$/.test(resultOp))
		throw new Error("Usage: !math <objective>.<selector> <operator> <expression>\n\te.g. !math money.@r += lottery.pot / 2 + 42");
		
	result = result.split(".");
	result = {
		objective: result[0],
		name: result[1]
	}
	
	var opstack = [];
	var postfix = [];
	var expectsOperator = false;
	
	var i = 0;
	while(i < formula.length)
	{
		var curr = formula[i];
		if(/\s/.test(curr))
		{
			i++;
		}
		else if(expectsOperator && curr != ")")
		{
			if(precendence[curr])
			{
				var prec = precendence[curr];
				while(precendence[opstack[0]] >= prec)
				{
					postfix.push(opstack[0]);
					opstack.splice(0, 1);
				}
				opstack.unshift(curr);
				i++;
				
				expectsOperator = false;
			}
			else
			{
				throw new Error("Unknown operator " + curr + " in math expression");
			}
		}
		else
		{
			if(curr == "(")
			{
				opstack.unshift("(");
				i++;
				expectsOperator = false;
			}
			else if(curr == ")")
			{
				while(opstack[0] && opstack[0] != "(")
				{
					postfix.push(opstack[0]);
					opstack.splice(0, 1);
				}
				opstack.splice(0, 1);
				i++;
				expectsOperator = true;
			}
			else
			{
				var str = curr;
				curr = formula[++i];
				while(curr && !/\s/.test(curr) && !precendence[curr])
				{
					str += curr;
					i++;
					curr = formula[i];
				}
				
				if(/^-?[0-9]+$/.test(str))
				{
					postfix.push(parseInt(str));
				}
				else if(str.indexOf(".") > 0)
				{
					var split = str.split(".");
					postfix.push({
						objective: split[0],
						name: split[1],
						dontChange: true
					});
				}
				else
				{
					throw new Error("unexpected " + JSON.stringify(str) + " in math expression");
				}
				
				expectsOperator = true;
			}
		}
	}
	
	for(var i = 0; i < opstack.length; i++)
		postfix.push(opstack[i]);
		
	var cmds = [];
	var currStatics = [];
	var valstack = [];
	var nextMutable = 0;
	
	for(var i = 0; i < postfix.length; i++)
	{
		var curr = postfix[i];
		if(typeof curr == "number" || typeof curr == "object")
			valstack.unshift(curr);
		else if(typeof curr == "string")
			op(curr);
	}
	
	if(valstack.length > 1)
		throw new Error("Invalid math expression: " + JSON.stringify(formula));
	
	valstack[1] = result;
	op(resultOp[0]);
	
	if(!statics)
	{
		statics = [];
		smelt.addInitCommand("scoreboard objectives add math dummy");
	}
	
	currStatics.forEach(function(val, i)
	{
		if(statics.indexOf(val) != -1 || currStatics.indexOf(val) != i)
			return;
		statics.push(val);
			
		smelt.addInitCommand([
			"scoreboard players set",
			"const" + val,
			"math",
			val
		].join(" "));
	});
	
	cmds.forEach(function(cmd)
	{
		smelt.addCommandBlock(cmd);
	});
	
	function op(operator)
	{
		if(valstack.length < 2)
			throw new Error("Invalid math expression " + JSON.stringify(formula));
		
		var left = valstack[1];
		var right = valstack[0];
		valstack.splice(0, 2);
		
		if(typeof left == "number" && typeof right == "number")
		{
			var result = compileTimeOps[operator](left, right);
			valstack.unshift(result);
		}
		else if((operator == "+" || operator == "-") && typeof right == "number")
		{
			if(left.dontChange)
				left = toMutable(left);
			if(right < 0)
			{
				right = -right;
				operator = operator == "+" ? "-" : "+";
			}
				
			var constOps = {
				"+": "add",
				"-": "remove"
			};
			cmds.push([
				"scoreboard players",
				constOps[operator],
				left.name,
				left.objective,
				right
			].join(" "));
			valstack.unshift(left);
		}
		else
		{
			if(typeof left == "number")
				left = toScore(left);
			if(typeof right == "number")
				right = toScore(right);
				
			if(left.dontChange)
				left = toMutable(left);
			
			placeOp(operator, left, right);
			valstack.unshift(left);
		}
	}
	function toMutable(val)
	{
		var mutable = {
			objective: "math",
			name: "r" + nextMutable
		};
		nextMutable++;
		placeOp("=", mutable, val);
		return mutable;
	}
	function toScore(val)
	{
		currStatics.push(val);
		return {
			objective: "math",
			name: "const" + val,
			dontChange: true
		};
	}
	function placeOp(operator, left, right)
	{
		if(operator != "=")
			operator += "=";
		cmds.push([
			"scoreboard players operation",
			left.name,
			left.objective,
			operator,
			right.name,
			right.objective
		].join(" "));
	}
}

module.exports = Math;
