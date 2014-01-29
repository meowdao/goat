"use strict";

var Q = require("q"),
    _ = require("underscore");

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
                module.exports.messages(request, [error instanceof Error ? error.toString() : error]);
                response.redirect(error.name === "ValidationError" ? request.url : "/error");
                /*
                if (error instanceof Error) { // mongoose validation error
                    switch (error.name) {
                        case "ValidationError":
                            module.exports.messages(request, Object.keys(error.errors).map(function (key) {
                                return error.errors[key].message;
                            }));
                            response.redirect(request.url);
                            break;
                        case "CastError" :
                            module.exports.messages(request, ["Value '" + error.value + "' is inaccessible."]);
                            response.redirect("/error");
                            break;
                        case "MongoError" :
                            module.exports.messages(request, ["User with this email already exists."]);
                            response.redirect("/error");
                            break;
                        default :
                            module.exports.messages(request, ["An error has occurred."]);
                            response.redirect("/error");
                    }
                } else {
                    module.exports.messages(request, error);
                    response.redirect("/error");
                }
                */
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
                response.render(method.name.replace("_", "/") + ".html", params);
            })
            .fail(function (error) {
                console.error(error);
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
                response.render(method.name.replace("_", "/") + ".html", params);
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

exports.roughSizeOfObject = function (object) {

    var objectList = [],
        stack = [ object ],
        bytes = 0;

    while (stack.length) {
        var value = stack.pop();
        if (typeof value === "boolean") {
            bytes += 4;
        } else if (typeof value === "string") {
            bytes += value.length * 2;
        } else if (typeof value === "number") {
            bytes += 8;
        } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
            objectList.push(value);
            for (var i in value) {
                stack.push(value[ i ]);
            }
        }
    }
    return bytes;
};


exports.getObject = function (parts, create, obj) {

    if (typeof parts === "string") {
        parts = parts.split(".");
    }

    if (typeof create !== "boolean") {
        obj = create;
        create = undefined;
    }

    var p;

    while (obj && parts.length) {
        p = parts.shift();
        if (obj[p] === undefined && create) {
            obj[p] = {};
        }
        obj = obj[p];
    }

    return obj;
};
