
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
			{type : 'textArea', params : ['greet', 'How are you ?']},
			{type : 'checkBox', params : ['greet2', 'Hello']}
		],
		{type : 'textArea', params : ['fuck', 'What the hell']},
		{type : 'choList', params : ['start', ['Hell', 'Oh', 'World'], 1]},
		{type : 'checkBox', params : ['fuck2', 'World', true]}
	];
	this._properties = {};
	this._contents = null;

	this._elemSize = 20;
	this._padding = 10;
	this._innerGap = 4;
	this._outerGap = 8;
	this._offsetY = -1.5;

	this._style = {font : 'bold ' + this._elemSize + 'px sans-serif', fill : 'white'};

	this._contents = this._getContents(this._elements.slice(0), 'vert');

	this.addChild(this._contents);
}

// extends Container
InstrBlock.prototype = Object.create(Container.prototype);
InstrBlock.prototype.constructor = InstrBlock;

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
InstrBlock.prototype._textArea = function(id, value) {
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
InstrBlock.prototype._checkBox = function(id, value, toggle) {
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
InstrBlock.prototype._choList = function(id, values, index) {
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
	choice.y += this._padding;

	// set ui
	this._properties[id] = values[index || 0];
	choice.setChoice((function(id, values, ix) {
		this._properties[id] = values[ix];
	}).bind(this, id, values), this);

	// return ui
	return base;
};

