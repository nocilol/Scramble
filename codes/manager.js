
//**************************************************************************
//--------------------------------------------------------------------------
// Stage Manager - Manager which manage stage and renderer
//--------------------------------------------------------------------------
//**************************************************************************
function StageManager() {
	// static class
	throw new Error('This is a static class');
}

//--------------------------------------------------------------------------
// Initialize manager
//--------------------------------------------------------------------------
StageManager.init = function(width, height) {
	// set attributes
	this._width = width;
	this._height = height;
	this._renderer = null;
	this.stage = null;
	this._animateFunc = null;

	// create renderer and stage
	this._createRenderer();
	this._createStage();

	// start animation
	this._start();
};

//--------------------------------------------------------------------------
// Create renderer
//--------------------------------------------------------------------------
StageManager._createRenderer = function() {
	// create renderer
	this._renderer = autoDetectRenderer(this._width, this._height);

	// append view of renderer to body of document
	document.body.appendChild(this._renderer.view);
};

//--------------------------------------------------------------------------
// Create stage
//--------------------------------------------------------------------------
StageManager._createStage = function() {
	// create stage
	this.stage = new Alterator();
};

//--------------------------------------------------------------------------
// Update renderer
//--------------------------------------------------------------------------
StageManager._updateRenderer = function() {
	// aliasing for shorter notation
	var wiWidth = window.innerWidth;
	var wiHeight = window.innerHeight;

	// find scale
	var scale = Math.min(wiWidth / this._width, wiHeight / this._height);

	// calculate scaled size
	var scWidth = this._width * scale;
	var scHeight = this._height * scale;

	// reset view-style of renderer
	this._renderer.view.style.position = 'absolute';
	this._renderer.view.style.width = scWidth + 'px';
	this._renderer.view.style.height = scHeight + 'px';
	this._renderer.view.style.left = (wiWidth - scWidth) / 2 + 'px';
	this._renderer.view.style.top = (wiHeight - scHeight) / 2 + 'px';
	this._renderer.view.style.display = 'block';
};

//--------------------------------------------------------------------------
// Start animation
//--------------------------------------------------------------------------
StageManager._start = function() {
	// request function of next frame
	var nextFrameFunc = this._start.bind(this);
	requestAnimationFrame(nextFrameFunc);

	// update renderer
	this._updateRenderer();

	// check if animation function exists
	if(this._animateFunc)
		this._animateFunc(); // call animation function

	// render stage
	this._renderer.render(this.stage);
};

//--------------------------------------------------------------------------
// Clear stage
//--------------------------------------------------------------------------
StageManager.clear =
	StageManager._createStage; // create new stage for clearing

//--------------------------------------------------------------------------
// Set animation function
//--------------------------------------------------------------------------
StageManager.setAnimate = function(func, context) {
	// create and set animation function
	this._animateFunc = func.bind(context);
};





//**************************************************************************
//--------------------------------------------------------------------------
// Image Manager - Manager which manage image loader
//--------------------------------------------------------------------------
//**************************************************************************
function ImageManager() {
	throw new Error('This is a static class');
}

//--------------------------------------------------------------------------
// Initialize Manager
//--------------------------------------------------------------------------
ImageManager.init = function(afterFunc, context) {
	// set function will be called after load process
	if (afterFunc && context)
		this._afterFunc = afterFunc.bind(context);

	// create list of images to load
	this.list();

	// load images and setup
	loader.add(this._loadList).load(this.setup.bind(this));
};

//--------------------------------------------------------------------------
// Create load list
//--------------------------------------------------------------------------
ImageManager.list = function() {
	// initialize load list
	this._loadList = [];
	
	// construct load list
	this._loadList.push(this._buttonPath = 'ui/red_button08.png');
	this._loadList.push(this._textFieldPath = 'ui/red_button03.png');
	this._loadList.push(this._choicePath = 'ui/red_button04.png');
	this._loadList.push(this._listPath = 'ui/grey_button09.png');
	this._loadList.push(this._checkOnPath = 'ui/red_boxCheckmark.png');
	this._loadList.push(this._checkOffPath = 'ui/grey_box.png');
	this._loadList.push(this._tickOnPath = 'ui/red_boxTick.png');
	this._loadList.push(this._tickOffPath = 'ui/grey_circle.png');
};

//--------------------------------------------------------------------------
// Setup manager
//--------------------------------------------------------------------------
ImageManager.setup = function() {
	// aliasing
	this.alias();

	// check if after function exists
	if(this._afterFunc)
		this._afterFunc(); // call after function
};

//--------------------------------------------------------------------------
// Aliasing for shorter notation
//--------------------------------------------------------------------------
ImageManager.alias = function() {
	// alias for shorter notation
	this.button = loader.resources[this._buttonPath].texture;
	this.textField = loader.resources[this._textFieldPath].texture;
	this.choice = loader.resources[this._choicePath].texture;
	this.list = loader.resources[this._listPath].texture;
	this.checkOn = loader.resources[this._checkOnPath].texture;
	this.checkOff = loader.resources[this._checkOffPath].texture;
	this.tickOn = loader.resources[this._tickOnPath].texture;
	this.tickOff = loader.resources[this._tickOffPath].texture;
};

