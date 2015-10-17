require("babel/register")({
	stage: 0
});

Error.stackTraceLimit = 25; // Infinity
//require("bluebird").longStackTraces();
require("q").longStackSupport = true;

var debug = require("debug");
debug.enable("controller:*");
debug.enable("test:*");
