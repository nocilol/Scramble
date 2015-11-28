
//**************************************************************************
// Test - Test
//**************************************************************************
function Test() {
	throw new Error('This is a static class');
}

//--------------------------------------------------------------------------
// Call test
//--------------------------------------------------------------------------
Test.call = function() {
	// image lists
	this._bgImage = 'images/Background.png';
	this._catImage = 'images/Cat.png';
	this._dogImage = 'images/Dog.png';

	// clear stage
	StageManager.clear();

	// reset loader
	loader.reset();

	// load images and setup test
	var that = this;
	loader.add([this._bgImage, this._catImage, this._dogImage])
	.load(function() {
		that.setup.call(that);
	});
};

//--------------------------------------------------------------------------
// Setup test
//--------------------------------------------------------------------------
Test.setup = function() {
	// add background, cat, and dog sprites in stage
	StageManager.stage.add('bg',new Sprite(
		loader.resources[this._bgImage].texture), true);
	StageManager.stage.add('cat', new Sprite(
		loader.resources[this._catImage].texture));
	StageManager.stage.add('dog', new Sprite(
		loader.resources[this._dogImage].texture));

	// set size of background
	StageManager.stage.get('bg').width = 1024;
	StageManager.stage.get('bg').height = 768;

	// set animate function
	StageManager.setAnimate(this.animate, this);

	// show background, cat, and dog in order
	StageManager.stage.show('bg');
	StageManager.stage.show('cat');
	StageManager.stage.show('dog');

	// show object before
	StageManager.stage.before();
	StageManager.stage.before();
};

//--------------------------------------------------------------------------
// Animate function of test
//--------------------------------------------------------------------------
Test.animate = function() {
	// move cat sprite by (2, 1)
	StageManager.stage.get('cat').x += 2;
	StageManager.stage.get('cat').y += 1;
};

