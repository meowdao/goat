process.env.NODE_ENV = process.env.NODE_ENV || "test";

require("babel/register")({
	stage: 0
});

Error.stackTraceLimit = 25; // Infinity
//require("bluebird").longStackTraces();
require("q").longStackSupport = true;

var debug = require("debug");
debug.enable("controller:*");
debug.enable("test:*");

var log = debug("log:mocha");

var mongoose = require("./mongoose.js")();

mongoose.set("debug", false);

process.on("uncaughtException", function (exception) {
	log(exception);
});
