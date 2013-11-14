"use strict";

module.exports = function (app, passport) {

    var controller = require("../controllers/user.js"),
        helper = require("../utils/helper.js"),
        middleware = require("../utils/middleware.js");

    app.get("/user/login", helper.simpleHTMLWrapper(controller.getLogin));
    app.post("/user/login",
        passport.authenticate("local", {
            failureRedirect: "/user/login",
            failureMessage: true
        }), controller.postLogin);

    app.get("/user/signup", helper.simpleHTMLWrapper(controller.getSignUp));
    app.post("/user/signup", controller.postSignUp);

    // JSON
    app.get("/user/getById", middleware.requiresParams(["id"]), helper.simpleJSONWrapper(controller.getById));
    app.get("/user/getWithQuery", helper.simpleJSONWrapper(controller.getWithQuery));

    // HTML
    app.get("/user/profile", helper.simpleHTMLWrapper(controller.profile));

    // 3rd party services
    app.get("/auth/facebook",
        passport.authenticate("facebook", {
            display: "popup",
            scope: ["email"],
            failureRedirect: "/user/login"
        }));

    app.get("/auth/facebook/callback",
        passport.authenticate("facebook", {
            failureRedirect: "/user/login"
        }), controller.authCallback);

    app.get("/auth/google",
        passport.authenticate("google", {
            failureRedirect: "/user/login",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ]
        }));

    app.get("/auth/google/callback",
        passport.authenticate("google", {
            failureRedirect: "/user/login"
        }), controller.authCallback);

};