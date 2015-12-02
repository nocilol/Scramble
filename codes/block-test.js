
function BlockTest() {
	throw new Error('This is a static class');
}

BlockTest.call = function() {
	// create container
	this._container = new ScrollContainer(1024, 768, 1024 * 2, 768 * 2);

	// create background
	this._testBack = new Sprite(ImageManager.background);
	this._testBack.width = 1024 * 2;
	this._testBack.height = 768 * 2;
	this._container.contents.addChild(this._testBack);

	// create test insturction block
	this._testIb = new InstrBlock('test', this._testRect);
	this._container.contents.addChild(this._testIb);

	// add test instruction block to stage and reposit it
	StageManager.stage.add('test', this._container, true);
	this._testIb.position.set(
		(1024 - this._testIb.width) / 2, (768 - this._testIb.height) / 2);

	// update container
	this._container.update();

	// set animate function
	StageManager.setAnimate(this._animate, this);
};

BlockTest._animate = function() {
	// interpret test instruction block
	this._testIb.interpret();
};

