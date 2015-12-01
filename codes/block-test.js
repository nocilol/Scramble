
function BlockTest() {
	throw new Error('This is a static class');
}

BlockTest.call = function() {
	// create test insturction block
	this._testIb = new InstrBlock('test');

	// add test instruction block to stage and reposit it
	StageManager.stage.add('test', this._testIb, true);
	this._testIb.position.set(
		(1024 - this._testIb.width) / 2, (768 - this._testIb.height) / 2);

	// set animate function
	StageManager.setAnimate(this._animate, this);
};

BlockTest._animate = function() {
	// interpret test instruction block
	this._testIb.interpret();
};

