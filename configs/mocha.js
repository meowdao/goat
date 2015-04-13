require("babel/register")({
	stage: 0
});

var debug = require("debug");
debug.enable("controller:*");
debug.enable("test:*");
