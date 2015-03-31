"use strict";

import passport from "passport";

import helper from "../utils/helper.js";
import middleware from "../utils/middleware.js";
import Controller from "../controllers/user.abstract.js";

export default function (app) {
    
    // user routes
    app.get("/user/login", helper.simpleHTMLWrapper(Controller.getLogin));
    app.post("/user/login",
        passport.authenticate("local", {
            failureRedirect: "/user/login",
            failureMessage: true
        }), helper.simpleRedirect(Controller.postLogin));

    app.get("/user/signup", helper.simpleHTMLWrapper(Controller.getSignUp));
    app.post("/user/signup", helper.simpleRedirect(Controller.postSignUp));

    app.get("/user/forgot", helper.simpleHTMLWrapper(Controller.getForgot));
    app.post("/user/forgot", helper.simpleRedirect(Controller.postForgot));

    app.get("/user/change/:hash", helper.simpleHTMLWrapper(Controller.getChange));
    app.post("/user/change/:hash", helper.simpleRedirect(Controller.postChange));

    app.get("/user/logout", Controller.logout);

    app.post("/user/sendEmailVerification", [middleware.requiresLogin], helper.simpleJSONWrapper(Controller.sendEmailVerification));
    app.get("/user/verify/:hash", helper.simpleRedirect(Controller.verify));

    app.get("/auth/facebook",
        passport.authenticate("facebook", {
            display: "popup",
            scope: ["email"],
            failureRedirect: "/user/login"
        }));

    app.get("/auth/facebook/callback", passport.authenticate("facebook"), helper.simpleHTMLWrapper(Controller.authCallback));

    app.get("/auth/google",
        passport.authenticate("google", {
            failureRedirect: "/user/login",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ]
        }));

    app.get("/auth/google/callback", passport.authenticate("google"), helper.simpleHTMLWrapper(Controller.authCallback));

};
