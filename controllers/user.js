"use strict";

var controller = require("../utils/controller.js"),
    helper = require("../utils/helper.js"),
    mongoose = require("mongoose"),
    User = mongoose.model("User"),
    _ = require("underscore");

var defaults = {

};

var methods = {
    authCallback: function user_authCallback() {
        return {};
    },
    profile: function user_profile(request) {
        return {
            user: request.user
        };
    },
    logout: function (request, response) {
        request.logout();
        response.redirect("user/login");
    },

    getLogin: function user_login(request) {
        if (request.headers.referer && request.headers.referer.indexOf("/user/login") === -1) {
            request.session.originalUrl = request.headers.referer;
        }
        var messages = request.session.messages || [];
        delete request.session.messages;
        return {
            messages: messages
        };
    },
    postLogin: function (request, response) {
        if (request.session.originalUrl) {
            response.redirect(request.session.originalUrl);
        } else {
            response.redirect("/");
        }
    },
    getSignUp: function user_signup(request) {
        var messages = request.session.messages || [],
            user = request.session.user || new User();
        delete request.session.messages;
        delete request.session.user;
        return {
            errors: messages,
            user: user
        };
    },
    postSignUp: function (request, response, next) {
        var user = new User(_.pick(request.body, ["first_name", "last_name", "email", "password", "confirm"])); // fix for prod proxy
        user.provider = "local";

        user.save(function (error) {
            console.error(error);
            if (error) {
                request.session.messages = helper.errors(error.errors);
                request.session.user = user;
                response.redirect("user/signup");
            } else {
                // manually login the user once successfully signed up
                request.logIn(user, function (error) {
                    if (error) {
                        console.error(error);
                        next(error);
                    }
                    response.redirect("/user/profile");
                });
            }
        });
    }
};

module.exports = _.extend(controller(User, defaults), methods);