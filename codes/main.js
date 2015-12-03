
//**************************************************************************
//--------------------------------------------------------------------------
// Main - Main
//--------------------------------------------------------------------------
//**************************************************************************

// log PIXI object into console
console.log(PIXI);

// initialize stage and renderer
StageManager.init(1024, 768);

// call UI test
// UiTest.call();

// call block test
ImageManager.init(function() {BlockTest.call()}, this);

var someStr = "$glvar_#sofla_$fskg = 31 * #lsjf";
function reduceStr(str) {
	return str.replace(/[$#][$#\w]+/gi, function(varExp) {
		console.log(varExp);
		while (varExp.match(/[$#]/gi).length > 1) {
			varExp = varExp.replace(/[$#]\w+/gi, function(subVarExp) {
				if (subVarExp.charAt(subVarExp.length - 1) == '_')
					return subVarExp
				else
					return '1';
			});
			console.log(varExp);
		}
		return varExp;
	});
};
console.log(reduceStr(someStr));

