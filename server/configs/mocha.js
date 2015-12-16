"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.HOST = process.env.HOST || "localhost";
process.env.PORT = process.env.PORT || "80";

require("babel-core/register");
require("babel-polyfill");

require("./moment.js");

Error.stackTraceLimit = Infinity;

var debug = require("debug");
debug.enable("controller:*");
debug.enable("model:*");
debug.enable("test:*");
debug.enable("log:*");

let bluebird = require("bluebird");
bluebird.longStackTraces();

let q = require("q");
q.longStackSupport = true;

let mongoose = require("./mongoose.js").default();
mongoose.set("debug", false);

process.on("uncaughtException", (exception) => {
	debug("log:mocha")(exception);
});

