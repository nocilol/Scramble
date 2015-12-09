
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
Block.prototype._getContents = function(element, orient) {
	// check if element is array
	if (element instanceof Array) { // array
		// find new orientation
		var newOrient = (orient == 'vert' ? 'horz' : 'vert');
		var newAlign = (newOrient == 'vert' ? 0 : 1);

		// create stacker
		var stacker = new Stacker(newOrient, newAlign, this._outerGap);

		// loop for each element
		var i;
		var leng = element.length;
		for (i = 0; i < leng; i++) {
			// get content recursively
			var content = this._getContents(element.shift(), newOrient);

			// add content to stacker
			stacker.add(content);
		};

		// add stacker into list
		this._stackers.push(stacker);

		// return stacker
		return stacker;
	} else { // not array - single object
		// return ui of element
		return this['_' + element.type].apply(this, element.params);
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
function InstrBlock(instr, globEnv, locEnv, charEnv, constraint) {
	// super
	Draggable.call(this, this, constraint || null);

	// set attributes
	this._instr = instr;
	this._globEnv = globEnv;
	this._locEnv = locEnv;
	this._charEnv = charEnv;
	this._block = null;
	this._interpretFunc = null;

	// setup
	this._setup();

	// add block to this(container)
	this.addChild(this._block);
};

// extends Draggable
InstrBlock.prototype = Object.create(Draggable.prototype);
InstrBlock.prototype.constructor = InstrBlock;

//--------------------------------------------------------------------------
// Setup instruction block
//--------------------------------------------------------------------------
InstrBlock.prototype._setup = function() {
	// call appropriate function by using instruction ID
	this['_' + this._instr['id']].call(this);
};

//--------------------------------------------------------------------------
// Start instruction block
//--------------------------------------------------------------------------
InstrBlock.prototype._start = function() {

	// set elements
	var values = this._instr['values'];
	var element = [
		{type : 'text', params : ['', '시작']}
	];

	// create block
	this._block = new Block(element, 'blue');

	// interpret function
	this._interpretFunc = function() {
		// delay 1 frame
		this._locEnv._delay += 1;

		// increase instruction counter
		this._locEnv._ic += 1;
	};
};

//--------------------------------------------------------------------------
// End instruction block
//--------------------------------------------------------------------------
InstrBlock.prototype._end = function() {

	// set elements
	var values = this._instr['values'];
	var element = [
		{type : 'text', params : ['', '종료']}
	];

	// create block
	this._block = new Block(element, 'blue');

	// interpret function
	this._interpretFunc = function() {
		// initialize instruction counter
		this._locEnv._ic = 0;
	};
};

InstrBlock.prototype._assign = function() {
	
	var values = this._instr['values'];
	var element = [
		{type : 'input', params : ['lvexp', values[0]]},
		{type : 'text', params : ['', '를 ']},
		{type : 'input', params : ['rexp', values[1]]},
		{type : 'text', params : ['', '로 설정한다']}
	];

	this._block = new Block(element, 'red');

	this._interpretFunc = function() {
		try {
			this._evalAssign(this._block.getProp('lvexp'), this._block.getProp('rexp'));
		} catch(error) {
			console.log(error.message);
		}

		this._locEnv._ic += 1;
	};
};

//--------------------------------------------------------------------------
// Wait instruction block
//--------------------------------------------------------------------------
InstrBlock.prototype._wait = function() {

	// set elements
	var values = this._instr['values'];
	var element = [
		{type : 'input', params : ['delay', values[0]]},
		{type : 'text', params : ['', ' 프레임 간 대기']}
	];

	// create block
	this._block = new Block(element, 'yellow');

	// interpret function
	this._interpretFunc = function() {
		// increase instruction counter
		this._locEnv._ic += 1;

		// set delay
		try {
			var delay = eval(this._block.getProp('delay'));
			this._locEnv._delay = delay;
		} catch(error) {
			console.log(error.message);
		}
	};
};

//--------------------------------------------------------------------------
// Test instruction block
//--------------------------------------------------------------------------
InstrBlock.prototype._test = function() {
	// INPORTANT: JUST KIDDING !!!

	// set elements
	var values = this._instr['values'];
	var element = [
		[
			{type : 'check', params : ['check1', '안정현', values[0]]},
			{type : 'check', params : ['check2', '권민규', values[1]]}
		],
		{type : 'input', params : ['text', values[2]]},
		{type : 'choice', params : ['list', ['사랑한다.', '좋아한다.', '싫어한다.'], values[3]]}
	];

	// create block
	this._block = new Block(element, 'red');

	// interpret function
	this._interpretFunc = function() {
		// get names and the number of us
		var names;
		if (this._block.getProp('check1') && this._block.getProp('check2')) {
			names = '안정현과 권민규는';
		} else if (this._block.getProp('check1')) {
			names = '안정현은';
		} else if (this._block.getProp('check2')) {
			names = '권민규는';
		} else {
			names = '아무도';
		}

		// print log to console
		console.log(names,
			this._block.getProp('text'), this._block.getProp('list'));

		// increase instruction counter
		this._locEnv._ic += 1;
	};
};

//--------------------------------------------------------------------------
// Evaluate assignment
//--------------------------------------------------------------------------
InstrBlock.prototype._evalAssign = function(lvexp, rexp) {
	// check left value is not a variable
	if (!lvexp.match(/^[$#@]?\w+$/i)) {
		throw new Error('Left value of assignment do not represent variable.');
	}

	// check if left value does not have scope expression
	if (!lvexp.match(/^[$#@].+/i))
		lvexp = '#' + lvexp; // add local expression mark
	
	// evaluate
	var evalExp = this._getExp(lvexp, 1) + ' = ' + this._getExp(rexp) + ';';
	eval(evalExp);
};

//--------------------------------------------------------------------------
// Get refine expression from expression
//--------------------------------------------------------------------------
InstrBlock.prototype._getExp = function(exp, level) {
	// replace variable expression
	return exp.replace(/[$#@][$#\w]+/gi, (function(varExp) {
		// find sub variable number
		var match = varExp.match(/[$#@]/gi);

		// loop until number of sub variables less or equal than level
		while ((match ? match.length : 0) > (level || 0)) {

			// replace sub variable
			varExp = varExp.replace(/[$#@]\w+/gi, (function(varSubExp) {
				// check if sub variable is chained
				if (varSubExp.charAt(varSubExp.length - 1) == '_') // chained
					return varSubExp; // return itself
				else // not chained
					return this._getVar(varSubExp); // return variable's value
			}).bind(this));

			// re-find sub variable number
			match = varExp.match(/[$#@]/gi);
		}

		// check main variable(unchained variable) exists
		if (varExp.charAt(0) == '$') // global
			return 'this._globEnv.' + varExp.slice(1); // return global expression
		else if (varExp.charAt(0) == '#') // local
			return 'this._locEnv.' + varExp.slice(1); // return local expression
		else if (varExp.charAt(0) == '@') // character
			return 'this._charEnv.' + varExp.slice(1); // return character expression
		else // not exists
			return varExp; // return itself
	}).bind(this));
}

//--------------------------------------------------------------------------
// Get variable value from expression
//--------------------------------------------------------------------------
InstrBlock.prototype._getVar = function(exp) {
	// find scope and name of variable
	var scope = exp.charAt(0);
	var name = exp.slice(1);

	// check scope
	if (scope == '$') { // global
		// check if variable exists
		if (this._globEnv[name])
			return this._globEnv[name]; // return variable
		else
			return this._globEnv[name] = 0; // initialize to 0 and return it
	} else if (scope == '#') { // local
		// check if variable exists
		if (this._locEnv[name])
			return this._locEnv[name]; // return variable
		else
			return this._locEnv[name] = 0; // initialize to 0 and return it
	} else if (scope == '@') { // character
		if (this._charEnv[name])
			return this._charEnv[name]; // return variable
		else
			return this._charEnv[name] = 0; // initialize to 0 and return it
	} else {
		// else - system error
		throw new Error('Expression does not represent variable.');
	}
};

//--------------------------------------------------------------------------
// Interpret instruction
//--------------------------------------------------------------------------
InstrBlock.prototype.interpret = function() {
	// call interpret function
	this._interpretFunc.call(this);
};





function InstrStack(globEnv, charEnv, constraint, instrList) {
	// super
	Stacker.call(this);

	// set attributes
	this._globEnv = globEnv;
	this._locEnv = {_ic : 0, _delay : 0};
	this._charEnv = charEnv;
	this._constraint = constraint || null;
	this._instrList = instrList || [];

	// add blocks
	this._addBlocks();
}

// extends Stacker
InstrStack.prototype = Object.create(Stacker.prototype);
InstrStack.prototype.constructor = InstrStack;

InstrStack.prototype._addBlocks = function() {
	// clear
	this.clear();

	// for each instruction in list
	var i;
	for (i = 0; i < this._instrList.length; i++) {
		// create and add block to this(stacker)
		this.add(new InstrBlock(
			this._instrList[i], this._globEnv, this._locEnv, this._charEnv, this._constraint));
	}
};

InstrStack.prototype.start = function() {
	// check if delay is needed
	if (this._locEnv._delay <= 0) {
		// interpret instruction
		this.get(this._locEnv._ic).interpret();

		// start next instruction
		this.start();
	} else {
		// decrease delay(frame)
		this._locEnv._delay -= 1;
	}
};





function SpriteItem(image, name, width, height, size, styleOn, styleOff, gap) {
	Button.call(this);

	this._image = image;
	this._name = name;
	this._width = width;
	this._height = height;
	this._size = size;
	this._styleOn = styleOn || {
		font : 'bold ' + this._size + 'px sans-serif',
		fill : 'red'
	};
	this._styleOff = styleOff || {
		font : 'bold ' + this._size + 'px sans-serif',
		fill : 'black'
	};
	this._gap = gap || 5;

	this._addSprite();
	this._addText();
}

SpriteItem.prototype = Object.create(Button.prototype);
SpriteItem.prototype.constructor = SpriteItem;

SpriteItem.prototype._addSprite = function() {
	this._sprite = new Sprite(this._image);

	this._sprite.width = this._width;
	this._sprite.height = this._height;

	this.addChild(this._sprite);
}

SpriteItem.prototype._addText = function() {
	this._text = new Text(this._name, this._styleOff);

	var posX = (this._width - this._text.width) / 2;
	var posY = this._height + this._gap;
	this._text.position.set(posX, posY);

	this.addChild(this._text);
}

SpriteItem.prototype.getName = function() {
	return this._name;
};

SpriteItem.prototype.set = function(flag) {
	if (flag)
		this._text.style = this._styleOn;
	else
		this._text.style = this._styleOff;
};





function SceneManager() {
	throw new Error('This is a static class.');
}

SceneManager.call = function() {
	this._spWidth = 200;
	this._spMargin = 20;

	this._ilWidth = 300;

	this._globEnv = {};
	this._chMap = {};
	this._isMap = {};

	this._addCreator();

	this._addMainWindow();
	this._addSpriteWindow();

	this._setSpriteWindow();

	this._addStage();
	this._addEvents();

	this._start();
};

SceneManager._addCreator = function() {
	this._creator = new Container();

	StageManager.stage.add('creator', this._creator, true);
}

SceneManager._addMainWindow = function() {
	this._mainWindow = new Alterator();

	this._creator.addChild(this._mainWindow);
};

SceneManager._addSpriteWindow = function() {
	this._spriteWindow = new Container();

	this._spriteWindow.x = 1024 - this._spWidth;

	this._creator.addChild(this._spriteWindow);
};

SceneManager._addStage = function() {
	var backPanel = new NinePatch(
		ImageManager.panel, 1024 - this._spWidth, 768);
	this._mainWindow.add('stage', backPanel, true);

	this._addStageSprite(
		'Background', ImageManager.background, backPanel.width, backPanel.height);
	this._addStageSprite('Cat', ImageManager.cat, 300, 300);
	this._addStageSprite('Dog', ImageManager.dog, 300, 300, 400, 350);

	var playSprite = new Sprite(ImageManager.play);
	playSprite.width = playSprite.height = 60;
	playSprite.position.set(backPanel.width - 20 - 60 - 20 - 60, 20);
	this._mainWindow.get('stage').addChild(playSprite);

	var stopSprite = new Sprite(ImageManager.stop);
	stopSprite.width = stopSprite.height = 60;
	stopSprite.position.set(backPanel.width - 20 - 60, 20);
	this._mainWindow.get('stage').addChild(stopSprite);
};

SceneManager._addStageSprite = function(name, image, width, height, x, y) {
	var sprite = new Sprite(image);
	sprite.width = width; sprite.height = height;
	sprite.position.set(x || 0, y || 0);
	// sprite.anchor.set(0.5, 0.5);
	
	var draggable = new Draggable(sprite, this._mainWindow);
	draggable.addChild(sprite);
	this._mainWindow.get('stage').addChild(draggable);

	this._chMap[name] = sprite;
};

SceneManager._setSpriteWindow = function() {
	var backPanel = new NinePatch(
		ImageManager.panel, this._spWidth, 768);
	this._spriteWindow.addChild(backPanel);

	var itemSize = this._spWidth - 2 * this._spMargin;

	this._spList = new Stacker(null, null, this._spMargin);
	this._spList.position.set(this._spMargin, this._spMargin);
	this._spriteWindow.addChild(this._spList);

	this._spList.add(new SpriteItem(
		ImageManager.background, 'Background', itemSize, itemSize, 20));
	this._spList.add(new SpriteItem(
		ImageManager.cat, 'Cat', itemSize, itemSize, 20));
	this._spList.add(new SpriteItem(
		ImageManager.dog, 'Dog', itemSize, itemSize, 20));
};

SceneManager._addEvents = function() {
	var i;
	for (i = 0; i < this._spList.size(); i++) {
		var spItem = this._spList.get(i);
		var key = 'event-' + spItem.getName();

		this._addEvent(spItem.getName());

		spItem.setClick((function(item, key) {
			var j;
			for (j = 0; j < this._spList.size(); j++) {
				this._spList.get(j).set(false);
			}

			if (this._mainWindow.current() != key) {
				this._mainWindow.show(key);
				item.set(true);
			} else {
				this._mainWindow.show('stage');
			}
		}).bind(this, spItem, key), this);
	}
};

SceneManager._addEvent = function(name) {
	var container = new Container();
	this._mainWindow.add('event-' + name, container);

	var backPanelLeft = new NinePatch(
		ImageManager.panel, 1024 - this._spWidth - this._ilWidth, 768);
	container.addChild(backPanelLeft);

	var backPanelRight = new NinePatch(
		ImageManager.panel, this._ilWidth, 768);
	backPanelRight.position.set(1024 - this._spWidth - this._ilWidth, 0);
	container.addChild(backPanelRight);

	var instrList = [
		{id : 'start', values : []},
		{id : 'assign', values : ['#x', '0']},
		{id : 'assign', values : ['#y', '1']},
		{id : 'wait', values : ['10']},
		{id : 'assign', values : ['#z', '2']},
		{id : 'wait', values : ['20']},
		{id : 'end', values : []}
	];
	var instrStack = new InstrStack(
		this._globEnv, this._chMap[name], backPanelLeft, instrList);
	instrStack.position.set(20, 20);
	backPanelLeft.addChild(instrStack);
	this._isMap[name] = instrStack;

	var instrList = [
		{id : 'start', values : []},
		{id : 'end', values : []},
		{id : 'assign', values : ['', '']},
		{id : 'wait', values : ['']},
	];
	var instrList = new InstrStack({}, {}, null, instrList);
	instrList.position.set(20, 20);
	backPanelRight.addChild(instrList);
};

SceneManager._start = function() {
	StageManager.setAnimate(function() {
		for (var key in this._isMap) {
			this._isMap[key].start();
		}
	}, this);
};

