
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
	this._loadList.push(this._backgroundPath = 'images/Background.png');
	this._loadList.push(this._catPath = 'images/Cat.png');
	this._loadList.push(this._dogPath = 'images/Dog.png');
	this._loadList.push(this._panelPath = 'ui/grey_panel.png');
	this._loadList.push(this._playPath = 'ui/play-button.png');
	this._loadList.push(this._stopPath = 'ui/stop-button.png');
	this._loadList.push(this._redButtonPath = 'ui/red_button08.png');
	this._loadList.push(this._blueButtonPath = 'ui/blue_button09.png');
	this._loadList.push(this._greenButtonPath = 'ui/green_button09.png');
	this._loadList.push(this._yellowButtonPath = 'ui/yellow_button09.png');
	this._loadList.push(this._redTextFieldPath = 'ui/red_button03.png');
	this._loadList.push(this._blueTextFieldPath = 'ui/blue_button06.png');
	this._loadList.push(this._greenTextFieldPath = 'ui/green_button06.png');
	this._loadList.push(this._yellowTextFieldPath = 'ui/yellow_button06.png');
	this._loadList.push(this._redChoicePath = 'ui/red_button04.png');
	this._loadList.push(this._blueChoicePath = 'ui/blue_button07.png');
	this._loadList.push(this._greenChoicePath = 'ui/green_button07.png');
	this._loadList.push(this._yellowChoicePath = 'ui/yellow_button07.png');
	this._loadList.push(this._listPath = 'ui/grey_button09.png');
	this._loadList.push(this._redCheckOnPath = 'ui/red_boxCheckmark.png');
	this._loadList.push(this._blueCheckOnPath = 'ui/blue_boxCheckmark.png');
	this._loadList.push(this._greenCheckOnPath = 'ui/green_boxCheckmark.png');
	this._loadList.push(this._yellowCheckOnPath = 'ui/yellow_boxCheckmark.png');
	this._loadList.push(this._checkOffPath = 'ui/grey_box.png');
	this._loadList.push(this._redTickOnPath = 'ui/red_boxTick.png');
	this._loadList.push(this._blueTickOnPath = 'ui/blue_boxTick.png');
	this._loadList.push(this._greenTickOnPath = 'ui/green_boxTick.png');
	this._loadList.push(this._yellowTickOnPath = 'ui/yellow_boxTick.png');
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
	this.background = loader.resources[this._backgroundPath].texture;
	this.cat = loader.resources[this._catPath].texture;
	this.dog = loader.resources[this._dogPath].texture;
	this.panel = loader.resources[this._panelPath].texture;
	this.play = loader.resources[this._playPath].texture;
	this.stop = loader.resources[this._stopPath].texture;
	this.button = {
		red : loader.resources[this._redButtonPath].texture,
		blue : loader.resources[this._blueButtonPath].texture,
		green : loader.resources[this._greenButtonPath].texture,
		yellow : loader.resources[this._yellowButtonPath].texture
	};
	this.textField = {
		red : loader.resources[this._redTextFieldPath].texture,
		blue : loader.resources[this._blueTextFieldPath].texture,
		green : loader.resources[this._greenTextFieldPath].texture,
		yellow : loader.resources[this._yellowTextFieldPath].texture
	};
	this.choice = {
		red : loader.resources[this._redChoicePath].texture,
		blue : loader.resources[this._blueChoicePath].texture,
		green : loader.resources[this._greenChoicePath].texture,
		yellow : loader.resources[this._yellowChoicePath].texture
	};
	this.list = {
		red : loader.resources[this._listPath].texture,
		blue : loader.resources[this._listPath].texture,
		green : loader.resources[this._listPath].texture,
		yellow : loader.resources[this._listPath].texture
	};
	this.checkOn = {
		red : loader.resources[this._redCheckOnPath].texture,
		blue : loader.resources[this._blueCheckOnPath].texture,
		green : loader.resources[this._greenCheckOnPath].texture,
		yellow : loader.resources[this._yellowCheckOnPath].texture
	};
	this.checkOff = {
		red : loader.resources[this._checkOffPath].texture,
		blue : loader.resources[this._checkOffPath].texture,
		green : loader.resources[this._checkOffPath].texture,
		yellow : loader.resources[this._checkOffPath].texture
	};
	this.tickOn = {
		red : loader.resources[this._redTickOnPath].texture,
		blue : loader.resources[this._blueTickOnPath].texture,
		green : loader.resources[this._greenTickOnPath].texture,
		yellow : loader.resources[this._yellowTickOnPath].texture
	};
	this.tickOff = {
		red : loader.resources[this._tickOffPath].texture,
		blue : loader.resources[this._tickOffPath].texture,
		green : loader.resources[this._tickOffPath].texture,
		yellow : loader.resources[this._tickOffPath].texture
	};
};

