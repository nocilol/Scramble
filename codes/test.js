
//**************************************************************************
// Test - Test
//**************************************************************************
function Test() {
	// static class
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
	this._npImage = 'ui/red_button08.png';

	// clear stage
	StageManager.clear();

	// reset loader
	loader.reset();

	// load images and setup test
	var setupFunc = this._setup.bind(this);
	loader.add([this._bgImage, this._catImage, this._dogImage, this._npImage])
	.load(setupFunc);
};

//--------------------------------------------------------------------------
// Setup test
//--------------------------------------------------------------------------
Test._setup = function() {
	// create container and background, cat, dog sprites
	this._container = new Container();
	this._bgSprite = new Sprite(loader.resources[this._bgImage].texture);
	this._catSprite = new Sprite(loader.resources[this._catImage].texture);
	this._dogSprite = new Sprite(loader.resources[this._dogImage].texture);

	// add background, and cat sprite to container
	this._container.addChild(this._bgSprite);
	this._container.addChild(this._catSprite);

	// create text-button and add it to container
	this._textBtn = new TextButton(
		loader.resources[this._npImage].texture, 250, 50, 'Hello World !');
	this._textBtn.position.set(750, 20)
	this._textBtn.setClick(this._clickText, this);
	this._container.addChild(this._textBtn);

	// create image-button and add it to container
	this._imgBtn = new ImageButton(
		loader.resources[this._bgImage].texture, 200, 100)
	this._imgBtn.position.set(400, 10);
	this._imgBtn.setClick(this._clickImage, this);
	this._container.addChild(this._imgBtn);
	
	// create scroll container and add it to container
	this._scrCont = new ScrollContainer(200, 200);
	this._scrCont.update(this._dogSprite.width, this._dogSprite.height);
	this._scrCont.contents.addChild(this._dogSprite);
	this._scrCont.position.set(20, 500);
	this._container.addChild(this._scrCont);

	// set size of background
	this._bgSprite.width = 1024;
	this._bgSprite.height = 768;

	// set animate function
	StageManager.setAnimate(this._animate, this);

	// add container in stage and show it
	StageManager.stage.add('test', this._container, true);
};

//--------------------------------------------------------------------------
// Animate function of test
//--------------------------------------------------------------------------
Test._animate = function() {
	// move cat sprite by (0.2, 0.1)
	this._catSprite.x += 0.2;
	this._catSprite.y += 0.1;
};

//--------------------------------------------------------------------------
// Click function of text-button
//--------------------------------------------------------------------------
Test._clickText = function() {
	// reset position of cat sprite
	this._catSprite.position.set(0, 0);
};

//--------------------------------------------------------------------------
// Click function of image-button
//--------------------------------------------------------------------------
Test._clickImage = function() {
	// change visibility of background
	this._bgSprite.visible = !this._bgSprite.visible;
};

//--------------------------------------------------------------------------
// Drag function of draggable
//--------------------------------------------------------------------------
Test._drag = function() {
	console.log('Drag Position: (' +
		this._draggable.x + ', ' + this._draggable.y + ')');
};

