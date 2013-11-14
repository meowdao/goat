"use strict";

var LocalStrategy = require("passport-local").Strategy,
    FacebookStrategy = require("passport-facebook").Strategy,
    GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
    userController = require("../controllers/user.js");

// http://passportjs.org/guide/profile/
module.exports = function (config, passport) {

    passport.serializeUser(function (user, callback) {
        callback(null, user._id);
    });

    passport.deserializeUser(function (id, callback) {
        userController.getOne({_id: id}, {lean: false})
            .then(function (user) {
                callback(null, user);
            })
            .fail(function (error) {
                callback(error, null);
            })
            .done();
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: "email",
            passwordField: "password"
        },
        function (user_name, password, callback) {
            userController.getOne({email: email}, {select: "+salt +hashed_password", lean:false})
                .then(function (user) {
                    if (!user || !user.authenticate(password)) {
                        callback(null, false, { message: "Invalid user name or password" });
                    }
                    callback(null, user);
                })
                .fail(function (error) {
                    callback(error, null);
                })
                .done();
        }
    ));

    passport.use(new FacebookStrategy(config.facebook,
        function (accessToken, refreshToken, profile, callback) {
            userController.getOne({"facebook.id": profile.id}, {lean: false})
                .then(function (user) {
                    if (!user) {
                        userController.insert({
                            first_name: profile.name.givenName,
                            last_name: profile.name.familyName,
                            email: profile.emails[0].value,
                            facebook: profile._json
                        })
                            .then(function (user) {
                                callback(null, user);
                            })
                            .fail(function (error) {
                                callback(error, null);
                            })
                            .done();
                    } else {
                        callback(null, user);
                    }
                })
                .fail(function (error) {
                    callback(error, null);
                })
                .done();
        }
    ));

    passport.use(new GoogleStrategy(config.google,
        function (accessToken, refreshToken, profile, callback) {
            userController.getOne({"google.id": profile.id}, {lean: false})
                .then(function (user) {
                    if (!user) {
                        userController.insert({
                            first_name: profile.name.givenName,
                            last_name: profile.name.familyName,
                            email: profile.emails[0].value,
                            google: profile._json
                        })
                            .then(function (user) {
                                callback(null, user);
                            })
                            .fail(function (error) {
                                callback(error, null);
                            })
                            .done();
                    } else {
                        callback(null, user);
                    }
                })
                .fail(function (error) {
                    callback(error, null);
                })
                .done();
        }
    ));

};
