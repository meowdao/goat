"use strict";

var env = process.env.NODE_ENV || "development",
    http = require("http"),
    express = require("express"),
    passport = require("passport"),
    app = express(),
	pkg = require("./package.json"),
    config = require("./configs/config.js")[env];

// configs
require("./configs/mongoose.js")(config);
require("./configs/passport.js")(config, passport);
require("./configs/express.js")(config, app, passport);
require("./configs/underscore.js")(app, pkg, env);

// routes
require("./routes/index.js")(app);
require("./routes/opt_out.js")(app);
require("./routes/user.js")(app);
require("./routes/user.abstract.js")(app, passport);

// starts the server
http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});

process.on("uncaughtException", function (exception) {
    console.error(exception.stack);
});

module.exports = app;