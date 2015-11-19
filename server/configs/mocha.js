process.env.NODE_ENV = process.env.NODE_ENV || "test";

require("babel-core/register");
require("babel-polyfill");

Error.stackTraceLimit = 25; // Infinity
//require("bluebird").longStackTraces();
require("q").longStackSupport = true;

let debug = require("debug");
debug.enable("controller:*");
debug.enable("model:*");
debug.enable("test:*");
debug.enable("log:*");

let log = debug("log:mocha");

let mongoose = require("./mongoose.js").default();

mongoose.set("debug", false);

process.on("uncaughtException", function (exception) {
	log(exception);
});
