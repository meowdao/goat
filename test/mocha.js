process.env.NODE_ENV = process.env.NODE_ENV || "test";

Error.stackTraceLimit = Infinity;

const debug = require("debug");
debug.enable("controller:*");
debug.enable("model:*");
debug.enable("test:*");
debug.enable("log:*");

// const bluebird = require("bluebird");
// bluebird.longStackTraces();

const q = require("q");
q.longStackSupport = true;

const mongoose = require("mongoose");
mongoose.set("debug", false);

process.on("uncaughtException", (exception) => {
	debug("log:mocha")(exception);
});
