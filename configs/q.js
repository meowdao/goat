"use strict";

var Q = require("q"),
    _ = require("lodash");

// Q_DEBUG=1 node app.js

module.exports = function () {

    if (process.env.NODE_ENV === "development") {
        Q.longStackSupport = true;
    }

    Q.superAll = function (obj) {
        var keys = _.keys(obj);
        return Q.spread(_.values(obj), function () {
            return _.zipObject(keys, arguments);
        });
    };

};
