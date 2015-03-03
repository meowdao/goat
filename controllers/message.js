"use strict";

var Q = require("q");

var methods = {
    show: function message (request) {
        return Q({
            type: request.params.type
        });
    }
};

module.exports = methods;

