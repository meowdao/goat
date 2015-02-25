"use strict";

var _ = require("lodash"),
    messager = require("../utils/messager.js");

exports.requiresParams = function (required) {
    return function (request, response, next) {
        var query = request.method === "POST" || request.method === "PUT" ? request.body : request.query;
        messager.makeError("no-param", _.every(required, function (e) {
            return !!query[e];
        }));
        return next();
    };
};

exports.requiresRole = function (required, self) {
    return function (request, response, next) {
        exports.requiresLogin(request, response, function () {
            messager.makeError("access-denied", _.contains(required, request.user.role) ||
            (self && request.user._id.toString() === request.params.id));
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

