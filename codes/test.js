
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
	this._tfImage = 'ui/red_button03.png';
	this._onImage = 'ui/red_boxCheckmark.png';
	this._offImage = 'ui/grey_box.png';

	// clear stage
	StageManager.clear();

	// reset loader
	loader.reset();

	// load images and setup test
	var setupFunc = this._setup.bind(this);
	loader.add([this._bgImage, this._catImage, this._dogImage,
		this._npImage, this._tfImage, this._onImage, this._offImage])
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
	this._textBtn.position.set(800, 20)
	this._textBtn.setClick(this._clickText, this);
	this._textBtn.fit();
	this._container.addChild(this._textBtn);

	// create image-button and add it to container
	this._imgBtn = new ImageButton(
		loader.resources[this._bgImage].texture, 200, 100)
	this._imgBtn.position.set(400, 10);
	this._imgBtn.setClick(this._clickImage, this);
	this._container.addChild(this._imgBtn);

	// create image-toggle and add it to container
	this._imgTgl = new ImageToggle(loader.resources[this._onImage].texture,
		loader.resources[this._offImage].texture, 40, 40, true);
	this._imgTgl.position.set(980, 720);
	this._imgTgl.setClick(this._clickToggle, this);
	this._container.addChild(this._imgTgl);

	// create scroll-container and add it to container
	this._scrCont = new ScrollContainer(200, 200);
	this._scrCont.update(this._dogSprite.width, this._dogSprite.height);
	this._scrCont.contents.addChild(this._dogSprite);
	this._scrCont.position.set(20, 500);
	this._container.addChild(this._scrCont);

	// create text-field and add it to container
	this._txtFld = new TextField(loader.resources[this._tfImage].texture,
		500, 50, 'Click and enter text.', true);
	this._txtFld.position.set(50, 50);
	this._container.addChild(this._txtFld);

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
// Click function of image-toggle
//--------------------------------------------------------------------------
Test._clickToggle = function(toggle) {
	// change visibility of cat sprite
	this._catSprite.visible = toggle;
};

