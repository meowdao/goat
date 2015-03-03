"use strict";

var _ = require("lodash"),
    messager = require("../utils/messager.js");

exports.requiresParams = function (required) {
    return function (request, response, next) {
        var query = request.method === "POST" || request.method === "PUT" ? request.body : request.query;
        if (!_.every(required, function (e) {
                return !!query[e];
            })) {
            return next(messager.makeError("no-param"));
        }
        return next();
    };
};

exports.requiresRole = function (required, self) {
    return function (request, response, next) {
        exports.requiresLogin(request, response, function () {
            if (!_.contains(required, request.user.role) || !(self && request.user._id.toString() === request.params.id)) {
                return next(messager.makeError("access-denied"));
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

