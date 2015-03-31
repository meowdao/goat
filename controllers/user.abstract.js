"use strict";

import Q from "q";
import _ from "lodash";
import mongoose from "mongoose";

import mail from "../utils/mail.js";
import messager from "../utils/messager.js";
import AbstractController from "../utils/controller.js";
import HashController from "./hash.js";

var Controller = new AbstractController(mongoose.model("User"), {
    populate: "avatar" // entity
});

var methods = {
    authCallback: function user_authCallback (request) {
        var originalUrl = request.session.originalUrl;
        delete request.session.originalUrl;
        return Q({
            redirect: originalUrl || "/user/profile"
        });
    },

    getLogin: function user_login (request) {
        if (!request.session.logout && request.headers.referer && request.headers.referer.indexOf("/user/login") === -1) {
            request.session.originalUrl = request.headers.referer;
        }
        delete request.session.logout;
        return Q({});
    },
    postLogin: function (request) {
        var originalUrl = request.session.originalUrl;
        delete request.session.originalUrl;
        return Q({
            url: originalUrl || "/user/profile"
        });
    },

    getSignUp: function user_signup (request) {
        var user = request.session.user || new (mongoose.model("User"))();
        delete request.session.user;
        return Q({
            user: user
        });
    },
    postSignUp: function (request) {
        return Controller.create(request.body, {}, request)
            .then(function (user) {
                // manually login the user once successfully signed up
                return Q.nbind(request.logIn, request)(user)
                    .thenResolve(request)
                    .then(Controller.loginCallback);
            })
            .fail(function (error) {
                request.session.user = request.body;
                throw error; // fail->fail chaining
            });
    },
    loginCallback: function (request) {
        Controller.sendEmailVerification({}, {}, request)
            .then(function (result) {
                result.url = "/user/profile";
                return result;
            });
    },

    getForgot: function user_forgot () {
        return Q({});
    },
    postForgot: function (request) {
        var clean = _.pick(request.body, ["email"]);
        return Controller.findOne(clean)
            .then(messager.checkModel("user-not-found"))
            .then(function (user) {
                return HashController.create({user: user._id})
                    .then(function (hash) {
                        mail.sendMail({
                            subject: "G.O.A.T Password Reset Instructions",
                            template: "remind"
                        }, {hash: hash}, {user: user});
                    })
                    .thenResolve({
                        messages: ["Email was sent"]
                    });
            });
    },

    getChange: function user_change (request) {
        return Q({
            hash: request.params.hash
        });
    },
    postChange: function (request) {
        return HashController.getByIdAndDate(request.params.hash)
            .then(function (hash) {
                return Controller.findById(hash.user, {lean: false})
                    .then(function (user) {
                        user.password = request.body.password;
                        user.confirm = request.body.confirm;
                        return Controller.save(user)
                            .then(function () {
                                return HashController.findByIdAndRemove(request.params.hash)
                                    .thenResolve({
                                        messages: ["Now you can login with your new password"]
                                    });
                            });
                    });
            });
    },

    sendEmailVerification: function (request) {
        return HashController.create({user: request.user._id})
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
        return HashController.getByIdAndDate(request.params.hash)
            .then(function (hash) {
                return Controller.findById(hash.user, {lean: false})
                    .then(function (user) {
                        user.email_verified = true;
                        return Controller.save(user)
                            .then(function () {
                                return HashController.findByIdAndRemove(request.params.hash)
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

export default _.extend(Controller, methods);

