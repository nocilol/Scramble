
function BlockTest() {
	throw new Error('This is a static class');
}

BlockTest.call = function() {
	this._container = new Container();

	this._testRect = new RectArea(1024, 768);
	this._container.addChild(this._testRect);

	// create test insturction block
	this._testIb = new InstrBlock('test', this._testRect);
	this._container.addChild(this._testIb);

	// add test instruction block to stage and reposit it
	StageManager.stage.add('test', this._container, true);
	this._testIb.position.set(
		(1024 - this._testIb.width) / 2, (768 - this._testIb.height) / 2);

	// set animate function
	StageManager.setAnimate(this._animate, this);
};

BlockTest._animate = function() {
	// interpret test instruction block
	this._testIb.interpret();
};

