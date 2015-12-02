
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

