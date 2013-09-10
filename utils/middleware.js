"use strict";

var _ = require("underscore");

exports.require = function (required) {
    return function (request, response, next) {
        var check = _.every(required, function (e) {
            return !!request.query[e];
        });
        if (check) {
            return next();
        } else {
            return next(new Error("Required parameter not found!"));
        }
    }

};