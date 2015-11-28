
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
	var that = this;
	requestAnimationFrame(function() {
		that._start.call(that);
	});

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
	this._animateFunc = function() {
		func.call(context);
	};
};

