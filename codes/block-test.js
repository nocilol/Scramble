
function BlockTest() {
	throw new Error('This is a static class');
}

BlockTest.call = function() {
	StageManager.stage.add('test', new InstrBlock(), true);
	StageManager.stage.get('test').position.set(50, 50);
};

