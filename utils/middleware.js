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