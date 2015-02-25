"use strict";

var Q = require("q");

module.exports = {

	filter: function (obj, keys, filter) {
		var result = {};
		Object.keys(obj || {}).forEach(function (key) {
			if ((keys.indexOf(key) === -1) !== filter) {
				result[key] = obj[key];
			}
		});
		return result;
	},

    simpleJSONWrapper: function (method) {
		var params = ["limit", "skip", "sort"];
        return function (request, response) {
			var key = ["query", "body", "params"].filter(function (key) { // TODO replace with find (ECMAScript6)
				return Object.keys(request[key]).length;
			})[0];
			method(module.exports.filter(request[key], params, false), module.exports.filter(request[key], params, true), request)
                .then(function (result) {
                    response.json(result);
                })
                .fail(module.exports.printStackTrace)
                .fail(function (error) {
                    // error instanceof mongoose.Error.ValidationError
                    if (error.name === "ValidationError") {
						response.status(200).send({error: 409, errors: module.exports.errors(error.errors)});
                    } else {
						response.status(200).send({error: error.status, errors: [error.message]});
                    }
                })
                .done();
        };
    },

    simpleRedirect: function (method) {
        return function (request, response, next) {
            method(request, response, next)
                .then(function (result) {
					module.exports.messages(request, "messages", result.messages);
                    response.redirect(result.url || "/notification");
                })
                .fail(module.exports.printStackTrace)
                .fail(function (error) {
                    // error instanceof mongoose.Error.ValidationError
                    if (error.name === "ValidationError") {
						module.exports.messages(request, "errors", module.exports.errors(error.errors));
                        response.redirect(request.url);
                    } else {
						module.exports.messages(request, "errors", error.message);
                        response.redirect("/error");
                    }
                })
                .done();
        };
    },

    simpleHTMLWrapper: function (method) {
        return function (request, response, next) {
            var result = method(request, response, next),
                keys = Object.keys(result);
            Q.all(keys.map(function (key) {
                return result[key];
            }))
                .then(function (results) {
					var params = {
						id: method.name,
						self: request.user
					};
                    keys.forEach(function (element, index) {
                        params[element] = results[index];
                    });
					["messages", "errors", "notifications"].forEach(function (field) {
						params[field] = request.session[field] || [];
						delete request.session[field];
					});
                    response.render(method.name.replace("_", "/") + ".hbs", params);
                })
                .fail(next) // see config/express.js
                .done();
        };
    },

    complicatedHTMLWrapper: function (method) {
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
    },

    /**
     * Prints stack trace and throws error to next Q.fail in the chain
     *
     * @param {Error} error
     * @param {Boolean} stop
     */
    printStackTrace: function (error, stop) {
        console.log(error.stack ? error.stack : "No stack trace available :(");
        console.error(error);
        if (!stop) {
            throw error;
        }
    },

    /**
     * Formats mongoose errors into proper array
     *
     * @param {Array} errors
     * @return {Array}
     * @api public
     */
    errors: function (errors) {
        return Object.keys(errors).map(function (key) {
            return errors[key].message;
        });
    },

    /**
     * Puts messages into session
     *
     * @param request
	 * @param field
	 * @param array
     */
	messages: function (request, field, array) {
		request.session[field] = [].concat(request.session[field], array).filter(function (e) {
            return e;
        });
    }

};
