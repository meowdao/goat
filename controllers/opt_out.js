"use strict";

var controller = require("../utils/controller.js"),
    mongoose = require("mongoose"),
    OptOut = mongoose.model("OptOut"),
    _ = require("underscore");

var methods = {
    getNotifications: function (query, params, request) {
        var types = {
            // key should be same as template name
            admin: {},
            user: {}
        };
        return module.exports.distinct({user: request.user}, {field: "type"})
            .then(function (checked) {
                return {
                    types: types[request.user.role],
                    checked: checked
                };
            });
    },
    postNotifications: function (query, params, request) {
        return module.exports.delete({user: request.user})
            .then(function () {
                return query.types ? module.exports.create(_.map(query.types, function (type) {
                    return {
                        type: type,
                        user: request.user
                    };
                })) : [];
            });
    }
};

module.exports = _.extend(controller(OptOut), methods);
