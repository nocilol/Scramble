
//**************************************************************************
//--------------------------------------------------------------------------
// Alterator - Container which can show only one contain-object
//--------------------------------------------------------------------------
//**************************************************************************
function Alterator() {
	// super
	Container.call(this);

	// set attributes
	this._map = {};
	this._stack = [];
	this._cur = null;
}

// extends Container
Alterator.prototype = Object.create(Container.prototype);
Alterator.prototype.constructor = Alterator;

//--------------------------------------------------------------------------
// Add object with key
//--------------------------------------------------------------------------
Alterator.prototype.add = function(key, object, show) {
	// set object to be invisible
	object.visible = false;

	// set object into map
	this.set(key, object);

	// add object in this(container)
	this.addChild(object);

	// show object if need
	if(show)
		this.show(key);
};

//--------------------------------------------------------------------------
// Set object into map
//--------------------------------------------------------------------------
Alterator.prototype.set = function(key, object) {
	// set object into map
	this._map[key] = object;
}

//--------------------------------------------------------------------------
// Get object from map
//--------------------------------------------------------------------------
Alterator.prototype.get = function(key) {
	// get object from map
	return this._map[key];
};

//--------------------------------------------------------------------------
// Show object by using key
//--------------------------------------------------------------------------
Alterator.prototype.show = function(key) {
	// check if current show object exists
	if(this._cur) {
		this._cur.visible = false; // set object to be invisible
		this._stack.push(this._cur); // add object into stack
	}

	// get object from map by using key
	//  and set it to be visible
	this.get(key).visible = true;

	// reset current object
	this._cur = this.get(key);
};

//--------------------------------------------------------------------------
// Hide all object
//--------------------------------------------------------------------------
Alterator.prototype.hide = function() {
	// check if current show object exists
	if(this._cur)
		this._cur.visible = false; // set object to be invisible

	// reset current object to null
	this._cur = null;
};

//--------------------------------------------------------------------------
// Show object before
//--------------------------------------------------------------------------
Alterator.prototype.before = function() {
	// check if current show object exists
	if(this._cur)
		this._cur.visible = false; // set object to be invisible

	// get object from stack
	var bef = this._stack.pop();

	// check if some object exists in stack
	if(bef)
		bef.visible = true; // set object to be visible

	// reset current object
	this._cur = bef;
};

//--------------------------------------------------------------------------
// Clear stack of all previous objects
//--------------------------------------------------------------------------
Alterator.prototype.clear = function() {
	// create new empty stack for clearing
	this._stack = [];
};

