
//**************************************************************************
//--------------------------------------------------------------------------
// Block - Container which contains several ui elements
//--------------------------------------------------------------------------
//**************************************************************************
function Block(elements, color) {
	// super
	Container.call(this);

	// set attributes
	this._elements = elements;
	this._color = color || 'red';
	this._properties = {};
	this._stackers = [];
	this._texts = [];
	this._checks = [];
	this._choices = [];
	this._inputs = [];
	this._contents = null;

	// set constants
	this._elemSize = 18;
	this._padding = 6;
	this._innerGap = 3;
	this._outerGap = 6;
	this._offsetY = -0.08;
	this._style = {font : 'bold ' + this._elemSize + 'px sans-serif',
		fill : 'white', stroke : 'black', strokeThickness : 2};

	// add background and contents
	this._addBackground();
	this._addContents();

	// update
	this._update();
}

// extends Container
Block.prototype = Object.create(Container.prototype);
Block.prototype.constructor = Block;

//--------------------------------------------------------------------------
// Add background
//--------------------------------------------------------------------------
Block.prototype._addBackground = function() {
	// create background by using nine-patch
	this._background = new NinePatch(ImageManager.button[this._color],
		2 * this._padding, 2 * this._padding);
	
	// add background to this(container)
	this.addChild(this._background);
};

//--------------------------------------------------------------------------
// Add contents
//--------------------------------------------------------------------------
Block.prototype._addContents = function() {
	// get(create) contents recursively
	this._contents = this._getContents(this._elements.slice(0), 'vert');

	// set position of contents
	this._contents.position.set(this._padding, this._padding);

	// add contents to this(container)
	this.addChild(this._contents);
};

//--------------------------------------------------------------------------
// Get contents
//--------------------------------------------------------------------------
Block.prototype._getContents = function(elements, orient) {
	if (elements instanceof Array) {
		// find new orientation
		var newOrient = (orient == 'vert' ? 'horz' : 'vert');
		var newAlign = (newOrient == 'vert' ? 0 : 1);

		// create stacker
		var stacker = new Stacker(newOrient, newAlign, this._outerGap);

		// loop for each elements
		var i;
		var leng = elements.length;
		for (i = 0; i < leng; i++) {
			// get content recursively
			var content = this._getContents(elements.shift(), newOrient);

			// add content to stacker
			stacker.add(content);
		};

		// add stacker into list
		this._stackers.push(stacker);

		// return stacker
		return stacker;
	} else {
		// return ui of element
		return this['_' + elements.type].apply(this, elements.params);
	}
};

//--------------------------------------------------------------------------
// Return text UI
//--------------------------------------------------------------------------
Block.prototype._text = function(id, value) {
	// create ui
	var base = new Stacker('horz', 1, this._innerGap);
	var text = new Text(value, this._style);
	this._texts.push(text);

	// construct ui
	base.add(text);

	// return ui
	return base;
};

//--------------------------------------------------------------------------
// Return check box UI
//--------------------------------------------------------------------------
Block.prototype._check = function(id, value, toggle) {
	// create ui
	var base = new Stacker('horz', 1, this._innerGap);
	var checkBox = new ImageToggle(
		ImageManager.checkOn[this._color], ImageManager.checkOff[this._color],
		this._elemSize, this._elemSize, toggle || false);
	var text = new Text(value, this._style);
	this._checks.push(checkBox);

	// construct ui
	base.add(checkBox);
	base.add(text);
	
	// set ui
	this._properties[id] = toggle || false;
	checkBox.setClick((function(id, toggle) {
		this._properties[id] = toggle;
	}).bind(this, id), this);

	// return ui
	return base;
};

//--------------------------------------------------------------------------
// Return choice list UI
//--------------------------------------------------------------------------
Block.prototype._choice = function(id, values, index) {
	// create ui
	var base = new Stacker('horz', 1, this._innerGap);
	var choice = new ChoiceList(
		ImageManager.choice[this._color], ImageManager.list[this._color],
		100, this._elemSize + 2 * this._padding, values, index || 0, true);
	this._choices.push(choice);

	// construct ui
	base.add(choice);

	// set ui
	this._properties[id] = values[index || 0];
	choice.setChoice((function(id, values, ix) {
		this._properties[id] = values[ix];
	}).bind(this, id, values), this);

	// return ui
	return base;
};

//--------------------------------------------------------------------------
// Return text field of UI
//--------------------------------------------------------------------------
Block.prototype._input = function(id, value) {
	// create ui
	var base = new Stacker('horz', 1, this._innerGap);
	var txtFld = new TextField(ImageManager.textField[this._color],
		100, this._elemSize + 2 * this._padding, value || '', true);
	this._inputs.push(txtFld);
	
	// construct ui
	base.add(txtFld);

	// set ui
	this._properties[id] = value || '';
	txtFld.setInput((function(id, text) {
		this._properties[id] = text;
		this._update();
	}).bind(this, id), this);

	// return ui
	return base;
};

//--------------------------------------------------------------------------
// Update
//--------------------------------------------------------------------------
Block.prototype._update = function() {
	// close all choice lists
	this.closeChoices();

	// loop for each stacker
	var i;
	for (i = 0; i < this._stackers.length; i++)
		this._stackers[i].update(); // update stacker

	// resize background
	this._background.resize(this._contents.width + 2 * this._padding,
		this._contents.height * (1 - this._offsetY) + 2 * this._padding);
};

//--------------------------------------------------------------------------
// Close all choice lists
//--------------------------------------------------------------------------
Block.prototype.closeChoices = function() {
	// for each choice lists
	var i;
	for (i = 0; i < this._choices.length; i++)
		this._choices[i].close(); // close choice list
};

//--------------------------------------------------------------------------
// Close all text fields
//--------------------------------------------------------------------------
Block.prototype.closeInputs = function() {
	// for each text fields
	var i;
	for (i = 0; i < this._inputs.length; i++)
		this._inputs[i].close(); // close text field
};

//--------------------------------------------------------------------------
// Get property of properties
//--------------------------------------------------------------------------
Block.prototype.getProp = function(id) {
	// if id parameter exists, return spedific property
	// if not, return map of properties
	return (id ? this._properties[id] : this._properties);
};





//**************************************************************************
//--------------------------------------------------------------------------
// Instruction Block - Draggable which represent instruction
//--------------------------------------------------------------------------
//**************************************************************************
function InstrBlock(instrId, constraint) {
	// super
	Draggable.call(this, null, constraint || null);

	// set attributes
	this._instrId = instrId;
	this._block = null;
	this._interpretFunc = null;

	// setup
	this._setup();

	// add block to this(container)
	this.addChild(this._block);
};

// extends Container
InstrBlock.prototype = Object.create(Draggable.prototype);
InstrBlock.prototype.constructor = InstrBlock;

//--------------------------------------------------------------------------
// Setup instruction block
//--------------------------------------------------------------------------
InstrBlock.prototype._setup = function() {
	// call appropriate function by using instruction ID
	this['_' + this._instrId].call(this);
};

//--------------------------------------------------------------------------
// Test instruction block
//--------------------------------------------------------------------------
InstrBlock.prototype._test = function() {
	// INPORTANT: JUST KIDDING !!!

	// set elements
	var elements = [
		{type : 'text', params : ['', 'Write console : ']},
		[
			{type : 'check', params : ['check1', 'Ahn Jeonghyeon', true]},
			{type : 'check', params : ['check2', 'Kwon Mingyu', true]}
		],
		{type : 'choice', params : ['list', ['love', 'like', 'hate', 'play', 'show'], 0]},
		{type : 'input', params : ['text', 'each other.']}
	];

	// create block
	this._block = new Block(elements, 'blue');

	// interpret function
	this._interpretFunc = function() {
		// get names and the number of us
		var names;
		var number;
		if (this._block.getProp('check1') && this._block.getProp('check2')) {
			names = 'Ahn Jeonghyeon and Kwon Mingyu'
			number = 2;
		} else if (this._block.getProp('check1')) {
			names = 'Ahn Jeonghyeon'
			number = 1;
		} else if (this._block.getProp('check2')) {
			names = 'Kwon Mingyu'
			number = 1;
		} else {
			names = 'Nobody'
			number = 0;
		}

		// print log to console
		console.log(names,
			this._block.getProp('list') + (number < 2 ? 's' : ''),
			this._block.getProp('text'));
	};
};

//--------------------------------------------------------------------------
// Interpret instruction
//--------------------------------------------------------------------------
InstrBlock.prototype.interpret = function() {
	// call interpret function
	this._interpretFunc.call(this);
};

