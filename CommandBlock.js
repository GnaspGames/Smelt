var CommandCreator = require("./CommandCreator");

var CommandBlock = (function () 
{
	function CommandBlock(inputX, inputY, inputZ, direction, type, conditional, auto) 
	{
		this.x = inputX;
		this.y = inputY;
		this.z = inputZ;
		this.direction = direction;
		this.type = type;
		this.conditional= conditional;
		this.auto= auto;
	}

	CommandBlock.prototype.getRelativeX = function()
	{
		console.log("this.x = " + this.x);
		console.log("CommandCreator.currentX = " + CommandCreator.currentX);
		return (this.x - CommandCreator.currentX);
	}

	CommandBlock.prototype.getRelativeY = function()
	{
		console.log("this.y = " + this.y);
		console.log("CommandCreator.currentY = " + CommandCreator.currentY);
		return (this.y - CommandCreator.currentY);
	}

	CommandBlock.prototype.getRelativeZ = function()
	{
		console.log("this.z = " + this.z);
		console.log("CommandCreator.currentZ = " + CommandCreator.currentZ);
		return (this.z - CommandCreator.currentZ);
	}

	return CommandBlock;

})();

module.exports = CommandBlock;