"use strict";

var Q = require("q");

// Q_DEBUG=1 node app.js

module.exports = function () {

    if (process.env.NODE_ENV === "development") {
        Q.longStackSupport = true;
    }

};
