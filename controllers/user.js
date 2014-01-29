"use strict";

var controller = require("./user.abstract.js"),
    _ = require("underscore");

var methods = {
    profile: function user_profile(request) {
        return {
            user: request.user
        };
    }
};

module.exports = _.extend(controller, methods);