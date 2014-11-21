"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

var http = require("http"),
    express = require("express"),
    passport = require("passport"),
    app = express(),
    config = require("./configs/config.js")[process.env.NODE_ENV];

// configs
require("./configs/q.js")();
require("./configs/mongoose.js")(config);
require("./configs/passport.js")(config, passport);
require("./configs/express.js")(config, app, passport);
require("./configs/handlebars.js")(config);

// starts the server
http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});

process.on("uncaughtException", function (exception) {
    console.error(exception.stack);
});

module.exports = app;