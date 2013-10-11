"use strict";

var Q = require("q");

exports.simpleJSONWrapper = function (method) {
    return function (request, response) {
        var params = ["limit", "skip", "sort"];
        method(Object.keys(request.query).length === 0 ? (Object.keys(request.body).length === 0 ? request.params : request.body) : _.omit(request.query, params), _.pick(request.query, params), request)
            .then(function (result) {
                response.json(result);
            })
            .fail(function (error) {
                console.error(error);
                response.send(500, error);
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
            .spread(function () {
                var params = {}, args = arguments;
                keys.map(function (element, index) {
                    params[element] = args[index];
                });
                response.render(method.name.replace("_", "/") + ".html", params);
            })
            .fail(function (error) {
                console.error(error);
                next(new Error(error));
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
            .spread(function () {
                var params = {}, args = arguments;
                keys.map(function (element, index) {
                    params[element] = args[index].state === "fulfilled" ? args[index].value : new Error(args[index].reason);
                });
                response.render(method.name.replace("_", "/") + ".html", params);
            })
            .fail(function (error) {
                console.error(error);
                next(new Error(error));
            })
            .done();
    };
};

exports.simpleCallback = function (deferred) {
    return function (error, result) {
        if (error) {
            console.error(error);
            deferred.reject(error);
        } else {
            deferred.resolve(result);
        }
    };
};

exports.simpleDeferred = function (query, params, defaults) {
    var deferred = Q.defer(),
        options = _.extend({lean:true}, defaults, params);
    Object.keys(options).forEach(function (method) {
        query[method](options[method]);
    });
    query.exec(this.simpleCallback(deferred));
    return deferred.promise;
};

exports.errors = function (errors) {
    return Object.keys(errors).map(function (key) {
        return errors[key].type;
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
