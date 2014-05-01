"use strict";

var Q = require("q"),
    _ = require("lodash");

exports.simpleJSONWrapper = function (method) {
    return function (request, response) {
        var params = ["limit", "skip", "sort"];
        // TODO drop _
        method(Object.keys(request.query).length === 0 ? (Object.keys(request.body).length === 0 ? _.extend({}, request.params) : request.body) : _.omit(request.query, params), _.pick(request.query, params), request)
            .then(function (result) {
                response.json(result);
            })
            .fail(function (error) {
                console.error(error);
                console.trace();
                if (error.name === "ValidationError") {
                    response.send(409, error);
                } else {
                    response.send(500, error);
                }
            })
            .done();
    };
};

exports.simpleRedirect = function (method) {
    return function (request, response, next) {
        method(request, response, next)
            .then(function (result) {
                module.exports.messages(request, result.messages);
                response.redirect(result.url || "/notification");
            })
            .fail(function (error) {
                console.log(error);
                console.trace();
                module.exports.messages(request, [error instanceof Error ? error.toString() : error]);
                response.redirect(error.name === "ValidationError" ? request.url : "/error");
            })
            .done();
    };
};

exports.simpleHTMLWrapper = function (method) {
    return function (request, response, next) {
        var result = method(request, response, next),
            keys = Object.keys(result);
        Q.all(keys.map(function (key) {
                return result[key];
            }))
            .then(function (results) {
                var params = {};
                keys.forEach(function (element, index) {
                    params[element] = results[index];
                });
                params.messages = request.session.messages || [];
                delete request.session.messages;
                response.render(method.name.replace("_", "/") + ".hbs", params);
            })
            .fail(function (error) {
                console.error(error);
                console.trace();
                next(error);
            })
            .done();
    };
};

exports.complicatedHTMLWrapper = function (method) {
    return function (request, response, next) {
        var result = method(request, response, next),
            keys = Object.keys(result);
        Q.allSettled(keys.map(function (key) {
                return result[key];
            }))
            .then(function (results) {
                var params = {};
                keys.forEach(function (element, index) {
                    params[element] = results[index].state === "fulfilled" ? results[index].value : new Error(results[index].reason);
                });
                params.messages = request.session.messages || [];
                delete request.session.messages;
                response.render(method.name.replace("_", "/") + ".hbs", params);
            })
            .fail(function (error) {
                console.error(error);
                next(error);
            })
            .done();
    };
};

exports.messages = function (request, messages) {
    request.session.messages = [].concat(request.session.messages, messages).filter(function (e) {
        return e;
    });
};
