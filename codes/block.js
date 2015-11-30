
//**************************************************************************
//--------------------------------------------------------------------------
// InstrBlock - Container which represent instruction
//--------------------------------------------------------------------------
//**************************************************************************
function InstrBlock() {
	// super
	Container.call(this);

	// set attributes -- just for testing
	this._elements = [
		[
			{type : 'text', params : ['greet', 'How are you ?']},
			{type : 'check', params : ['greet2', 'Hello']}
		],
		{type : 'text', params : ['fuck', 'What the hell']},
		{type : 'input', params : ['sentence', 'My name is ...']},
		{type : 'choice', params : ['start', ['Hell', 'Oh', 'World'], 1]},
		{type : 'check', params : ['fuck2', 'World', true]}
	];
	this._properties = {};
	this._stackers = [];
	this._contents = null;

	this._elemSize = 20;
	this._padding = 10;
	this._innerGap = 4;
	this._outerGap = 8;
	this._offsetY = -0.15;

	this._style = {font : 'bold ' + this._elemSize + 'px sans-serif',
		fill : 'white', stroke : 'black', strokeThickness : 2};

	this._addContents();
	this._addBackground();
}

// extends Container
InstrBlock.prototype = Object.create(Container.prototype);
InstrBlock.prototype.constructor = InstrBlock;

InstrBlock.prototype._addContents = function() {
	// get(create) contents recursively
	this._contents = this._getContents(this._elements.slice(0), 'vert');

	// set position of contents
	this._contents.position.set(this._padding, this._padding);
};

InstrBlock.prototype._addBackground = function() {
	// create background by using nine-patch
	this._background = new NinePatch(ImageManager.button,
		this._contents.width + 2 * this._padding,
		this._contents.height * (1 - this._offsetY) + 2 * this._padding);
	
	// add background and contents to this(container)
	this.addChild(this._background);
	this.addChild(this._contents);
};

//--------------------------------------------------------------------------
// Get contents
//--------------------------------------------------------------------------
InstrBlock.prototype._getContents = function(elements, orient) {
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
InstrBlock.prototype._text = function(id, value) {
	// create ui
	var base = new Stacker('horz', 1, this._innerGap);
	var text = new Text(value, this._style);

	// construct ui
	base.add(text);

	// return ui
	return base;
};

//--------------------------------------------------------------------------
// Return check box UI
//--------------------------------------------------------------------------
InstrBlock.prototype._check = function(id, value, toggle) {
	// create ui
	var base = new Stacker('horz', 1, this._innerGap);
	var checkBox = new ImageToggle(
		ImageManager.checkOn, ImageManager.checkOff,
		this._elemSize, this._elemSize, toggle || false);
	var text = new Text(value, this._style);

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
InstrBlock.prototype._choice = function(id, values, index) {
	// find item which has maximum length
	var maxL = 0;
	var maxI = 0;
	var i;
	for (i = 0; i < values.length; i++) {
		if (maxL < values[i].length) {
			maxL = values[i].length;
			maxI = i;
		}
	}

	// create ui
	var base = new Stacker('horz', 1, this._innerGap);
	var choice = new ChoiceList(
		ImageManager.choice, ImageManager.list,
		100, this._elemSize + 2 * this._padding, values, maxI);
	choice.fit();
	choice.setIndex(index || 0);

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
InstrBlock.prototype._input = function(id, value) {
	// create ui
	var base = new Stacker('horz', 1, this._innerGap);
	var txtFld = new TextField(ImageManager.textField,
		100, this._elemSize + 2 * this._padding, value || '', true);
	
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

InstrBlock.prototype._update = function() {
	// loop for each stacker
	var i;
	for (i = 0; i < this._stackers.length; i++)
		this._stackers[i].update(); // update stacker

	// resize background
	this._background.resize(this._contents.width + 2 * this._padding,
		this._contents.height * (1 - this._offsetY) + 2 * this._padding);
};

