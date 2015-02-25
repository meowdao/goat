"use strict";

var controller = require("../utils/controller.js"),
    mail = require("../utils/mail.js"),
    mongoose = require("mongoose"),
    User = mongoose.model("User"),
    Q = require("q"),
    _ = require("lodash"),
    hashController = require("./hash.js");

var defaults = {
    populate: "avatar" // entity
};

var methods = {
    authCallback: function user_authCallback () {
        return {};
    },

    getLogin: function user_login (request) {
        if (!request.session.logout && request.headers.referer && request.headers.referer.indexOf("/user/login") === -1) {
            request.session.originalUrl = request.headers.referer;
        }
        delete request.session.logout;
        return {};
    },
    postLogin: function (request) {
        var originalUrl = request.session.originalUrl;
        delete request.session.originalUrl;
        return Q({
            url: originalUrl || "/user/profile"
        });
    },

    getSignUp: function user_signup (request) {
        var user = request.session.user || new User();
        delete request.session.user;
        return {
            user: user
        };
    },
    postSignUp: function (request) {
        return module.exports.create(request.body, {}, request)
            .then(function (user) {
                // manually login the user once successfully signed up
                return Q.nbind(request.logIn, request)(user)
                    .thenResolve(request)
                    .then(module.exports.loginCallback);
            })
            .fail(function (error) {
                request.session.user = request.body;
                throw error; // fail->fail chaining
            });
    },
    loginCallback: function (request) {
        module.exports.sendEmailVerification({}, {}, request)
            .then(function (result) {
                result.url = "/user/profile";
                return result;
            });
    },

    getForgot: function user_forgot () {
        return {};
    },
    postForgot: function (request) {
        var clean = _.pick(request.body, ["email"]);
        return module.exports.findOne(clean)
            .then(function (user) {
                if (user) {
                    hashController.create({user: user._id})
                        .then(function (hash) {
                            mail.sendMail({
                                subject: "G.O.A.T Password Reset Instructions",
                                template: "remind"
                            }, {hash: hash}, {user: user});
                        })
                        .done();
                }
                return {
                    messages: ["Email was sent"]
                };
            });
    },

    getChange: function user_change (request) {
        return {
            hash: request.params.hash
        };
    },
    postChange: function (request) {
        return hashController.getByIdAndDate(request.params.hash)
            .then(function (hash) {
                return module.exports.findById(hash.user, {lean: false})
                    .then(function (user) {
                        user.password = request.body.password;
                        user.confirm = request.body.confirm;
                        return module.exports.save(user)
                            .then(function () {
                                return hashController.findByIdAndRemove(request.params.hash)
                                    .thenResolve({
                                        messages: ["Now you can login with your new password"]
                                    });
                            });
                    });
            });
    },

    sendEmailVerification: function (query, params, request) {
        return hashController.create({user: request.user._id})
            .then(function (hash) {
                return mail.sendMail({
                    subject: "G.O.A.T Email Verification",
                    template: "verify"
                }, {hash: hash}, request)
                    .thenResolve({
                        messages: ["Verification email was sent to " + request.user.email]
                    });
            });
    },

    verify: function (request) {
        return hashController.getByIdAndDate(request.params.hash)
            .then(function (hash) {
                return module.exports.findById(hash.user, {lean: false})
                    .then(function (user) {
                        user.email_verified = true;
                        return module.exports.save(user)
                            .then(function () {
                                return hashController.findByIdAndRemove(request.params.hash)
                                    .thenResolve({
                                        messages: ["Email is verified"]
                                    });
                            });
                    });
            });
    },

    logout: function (request, response) {
        request.logout();
        request.session.logout = true;
        response.clearCookie();
        response.redirect("user/login");
    }
};

module.exports = _.extend(controller(User, defaults), methods);

