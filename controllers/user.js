"use strict";

var controller = require("./user.abstract.js"),
    _ = require("lodash"),
    Q = require("q");

var methods = {
    profile: function user_profile(request) {
        return Q({
            user: request.user
        });
    }
};

module.exports = _.extend(controller, methods);
