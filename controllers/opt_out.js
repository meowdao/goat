"use strict";

var controller = require("../utils/controller.js"),
    mongoose = require("mongoose"),
    OptOut = mongoose.model("OptOut"),
    Q = require("q"),
    _ = require("lodash");

var methods = {
    getNotifications: function (query, params, request) {
        var types = {
            // key should be same as template name
            admin: {},
            user: {}
        };
        return module.exports.distinct({user: request.user._id}, {field: "type"})
            .then(function (checked) {
                return {
                    types: types[request.user.role],
                    checked: checked
                };
            });
    },
    postNotifications: function (query, params, request) {
        return module.exports.remove({user: request.user._id})
            .then(function () {
                return query.types ? module.exports.create(_.map(query.types, function (type) {
                    return {
                        type: type,
                        user: request.user
                    };
                })) : Q([]);
            });
    }
};

module.exports = _.extend(controller(OptOut), methods);
