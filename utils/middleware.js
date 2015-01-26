"use strict";

var _ = require("lodash"),
    messager = require("../utils/messager.js");

module.exports = {
    requiresParams: function (required) {
        return function (request, response, next) {
            var query = request.method === "POST" || request.method === "PUT" ? request.body : request.query,
                check = _.every(required, function (e) {
                    return !!query[e];
                });
            if (!check) {
                return next(messager.makeError("no-param", true));
            }
            return next();
        };
    },

    requiresRole: function (required) {
        return function (request, response, next) {
            exports.requiresLogin(request, response, function () {
                if (!_.contains(required, request.user.role)) {
                    return next(messager.makeError("access-denied", true));
                }
                return next();
            });
        };
    },

    requiresLogin: function (request, response, next) {
        if (!request.isAuthenticated()) {
            request.session.originalUrl = request.originalUrl;
            return response.redirect("/user/login");
        }
        return next();
    }
};
