"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

import http from "http";

import app from "./configs/express.js";

// starts the server
http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});

process.on("uncaughtException", function (exception) {
    console.error(exception.stack);
});
