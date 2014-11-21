"use strict";

var Q = require("q"),
    _ = require("lodash");

module.exports = {

    simpleJSONWrapper: function (method) {
        return function (request, response) {
            var params = ["limit", "skip", "sort"];
            // TODO drop _
            method(Object.keys(request.query).length === 0 ? (Object.keys(request.body).length === 0 ? _.extend({}, request.params) : request.body) : _.omit(request.query, params), _.pick(request.query, params), request)
                .then(function (result) {
                    response.header("Access-Control-Allow-Origin", "*"); // TODO move to express config
                    response.json(result);
                })
                .fail(module.exports.printStackTrace)
                .fail(function (error) {
                    // error instanceof mongoose.Error.ValidationError
                    if (error.name === "ValidationError") {
                        response.status(200).send({error: 409, message: module.exports.errors(error.errors)});
                    } else {
                        response.status(200).send({error: error.status, message: error.message});
                    }
                })
                .done();
        };
    },

    simpleRedirect: function (method) {
        return function (request, response, next) {
            method(request, response, next)
                .then(function (result) {
                    module.exports.messages(request, result.messages);
                    response.redirect(result.url || "/notification");
                })
                .fail(module.exports.printStackTrace)
                .fail(function (error) {
                    // error instanceof mongoose.Error.ValidationError
                    if (error.name === "ValidationError") {
                        module.exports.messages(request, module.exports.errors(error.errors));
                        response.redirect(request.url);
                    } else {
                        module.exports.messages(request, error);
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
                    var params = {};
                    keys.forEach(function (element, index) {
                        params[element] = results[index];
                    });
                    params.messages = request.session.messages || [];
                    delete request.session.messages;
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
     * @param messages
     */
    messages: function (request, messages) {
        request.session.messages = [].concat(request.session.messages, messages).filter(function (e) {
            return e;
        });
    }

};
