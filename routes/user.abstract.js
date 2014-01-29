"use strict";

module.exports = function (app, passport) {

    var controller = require("../controllers/user.abstract.js"),
        helper = require("../utils/helper.js"),
        middleware = require("../utils/middleware.js");

    // user routes
    app.get("/user/login", helper.simpleHTMLWrapper(controller.getLogin));
    app.post("/user/login",
        passport.authenticate("local", {
            failureRedirect: "/user/login",
            failureMessage: true
        }), helper.simpleRedirect(controller.postLogin));

    app.get("/user/signup", helper.simpleHTMLWrapper(controller.getSignUp));
    app.post("/user/signup", helper.simpleRedirect(controller.postSignUp));

    app.get("/user/forgot", helper.simpleHTMLWrapper(controller.getForgot));
    app.post("/user/forgot", helper.simpleRedirect(controller.postForgot));

    app.get("/user/change/:hash", helper.simpleHTMLWrapper(controller.getChange));
    app.post("/user/change", helper.simpleRedirect(controller.postChange));

    app.get("/user/logout", controller.logout);

    app.post("/user/sendEmailVerification", [middleware.requiresLogin], helper.simpleJSONWrapper(controller.sendEmailVerification));
    app.get("/user/verify/:hash", helper.simpleRedirect(controller.verify));

    app.get("/auth/facebook",
        passport.authenticate("facebook", {
            display: "popup",
            scope: ["email"],
            failureRedirect: "/user/login"
        }));

    app.get("/auth/facebook/callback", passport.authenticate("facebook"), helper.simpleHTMLWrapper(controller.authCallback));

    app.get("/auth/google",
        passport.authenticate("google", {
            failureRedirect: "/user/login",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ]
        }));

    app.get("/auth/google/callback", passport.authenticate("google"), helper.simpleHTMLWrapper(controller.authCallback));

};
