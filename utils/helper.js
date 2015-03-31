"use strict";

import _ from "lodash";
import lang from "../utils/lang.js";

module.exports = {

    simpleJSONWrapper: function (method) {
        return function (request, response, next) {
            method(request, response, next)
                .then(response.json)
                .fail(module.exports.printStackTrace)
                .fail(function (error) {
                    // error instanceof mongoose.Error.ValidationError
                    if (error.name === "ValidationError") {
                        response.status(200).send({error: 409, errors: _.pluck(error.errors, "message")});
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
                        module.exports.messages(request, "errors", _.pluck(error.errors, "message"));
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
            method(request, response, next)
                .then(function (results) {
                    _.extend(results, {
                        id: method.name,
                        url: request.url,
                        self: request.user,
                        lang: lang.getLanguage(request.user)
                    });
                    ["messages", "errors", "notifications"].forEach(function (field) {
                        results[field] = request.session[field] || [];
                        delete request.session[field];
                    });
                    response.render(method.name.replace("_", "/") + ".hbs", results);
                })
                .fail(next) // see config/routes.js
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
