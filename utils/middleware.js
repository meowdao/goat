"use strict";

var _ = require("lodash");

exports.requiresParams = function (required) {
    return function (request, response, next) {
        var query = request.method === "POST" || request.method === "PUT" ? request.body : request.query,
            check = _.every(required, function (e) {
                return !!query[e];
            });
        if (!check) {
            var error = new Error("Required parameter not found");
            error.status = 400;
            return next(error);
        }
        return next();
    };
};

exports.requiresRole = function (required) {
    return function (request, response, next) {
        exports.requiresLogin(request, response, function () {
            if (!_.contains(required, request.user.role)) {
                var error = new Error("Access denied");
                error.status = 403;
                return next(error);
            }
            return next();
        });
    };
};

exports.requiresLogin = function (request, response, next) {
    if (!request.isAuthenticated()) {
        request.session.originalUrl = request.originalUrl;
        return response.redirect("/user/login");
    }
    return next();
};
