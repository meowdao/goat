"use strict";

var Q = require("q");

exports.simpleJSONWrapper = function (method) {
    return function (request, response) {
        method(Object.keys(request.query).length === 0 ? (Object.keys(request.body).length === 0 ? request.params : request.body) : request.query, {}, request)
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
            deferred.reject(error);
        } else {
            deferred.resolve(result);
        }
    };
};

exports.simpleDeferred = function (query) {
    var deferred = Q.defer();
    query.exec(this.simpleCallback(deferred));
    return deferred.promise;
};

exports.simpleDelete = function (model, query) {
	return this.simpleDeferred(model.remove(query));
};

exports.simpleInsert = function (model, query) {
    var deferred = Q.defer();
    model.create(query, this.simpleCallback(deferred));
    return deferred.promise;
};

exports.simpleUpsert = function (model, query, params) {
    var deferred = Q.defer();
    model.update(query, params, {upsert: true, strict: true}, this.simpleCallback(deferred));
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