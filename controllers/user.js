"use strict";

var controller = require("../utils/controller.js"),
    mongoose = require("mongoose"),
    User = mongoose.model("User"),
	_ = require("underscore");

var methods = {
    profile: function user_profile (query) {
        return {
            user: module.exports.getById(query)
        };
    }
};

module.exports = _.extend(controller(User), methods);