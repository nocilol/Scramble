
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

	// create test insturction stack
	this._testInstrList = [
		{id : 'start', values : []},
		{id : 'test', values : [true, true, '서로를', 0]},
		{id : 'wait', values : ['30']},
		{id : 'end', values : []}
	];
	this._testIs = new InstrStack(
		{}, this._testBack, this._testRect, this._testInstrList);
	this._container.contents.addChild(this._testIs);

	// add test instruction block to stage and reposit it
	StageManager.stage.add('test', this._container, true);
	this._testIs.position.set(200, 100);

	// update container
	this._container.update();

	// set animate function
	StageManager.setAnimate(this._animate, this);
};

BlockTest._animate = function() {
	// start test instruction stack
	this._testIs.start();
};

