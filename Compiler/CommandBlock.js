

var CommandBlock = (function () 
{
	function CommandBlock(inputX, inputY, inputZ, direction, type, conditional, auto, trackOutput) 
	{
		this.x = inputX;
		this.y = inputY;
		this.z = inputZ;
		this.direction = direction;
		this.type = type;
		this.conditional= conditional;
		this.auto= auto;
		this.trackOutput = trackOutput;
	}

	CommandBlock.prototype.getRelativeX = function()
	{
		return (this.x - CommandCreator.currentCommandBlock.x);
	}

	CommandBlock.prototype.getRelativeY = function()
	{
		return (this.y - CommandCreator.currentCommandBlock.y);
	}

	CommandBlock.prototype.getRelativeZ = function()
	{
		return (this.z - CommandCreator.currentCommandBlock.z);
	}

	return CommandBlock;

})();

module.exports = CommandBlock;