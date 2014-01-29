"use strict";

var _ = require("underscore");

exports.requiresParams = function (required) {
    return function (request, response, next) {
        var query = request.method === "POST" || request.method === "PUT" ? request.body : request.query,
            check = _.every(required, function (e) {
                return !!query[e];
            });
        if (check) {
            return next();
        } else {
            return next(new Error("Required parameter not found!"));
        }
    };
};

exports.requiresLogin = function (request, response, next) {
    if (!request.isAuthenticated()) {
        request.session.originalUrl = request.originalUrl;
        return response.redirect("/user/login");
    }
    return next();
};

exports.requiresRole = function (required) {
    return function (request, response, next) {
        exports.requiresLogin(request, response, function () {
            if (_.contains(required, request.user.role)) {
                return next();
            } else {
                return next(new Error("Access denied"));
            }
        });
    };
};