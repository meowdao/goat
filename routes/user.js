"use strict";

import passport from "passport";
import helper from "../utils/helper.js";
import middleware from "../utils/middleware.js";
import UserController from "../controllers/user.js";

var userController = new UserController();

export default function (app) {

	// user routes
	app.post("/user/login", helper.simpleJSONWrapper(userController.login.bind(userController)));

	app.post("/user/signup", helper.simpleJSONWrapper(userController.signUp.bind(userController)));

	app.post("/user/forgot", helper.simpleJSONWrapper(userController.forgot.bind(userController)));

	app.post("/user/change/:hash", helper.simpleJSONWrapper(userController.change.bind(userController)));

	app.get("/user/logout", userController.logout.bind(userController));

	app.post("/user/sendEmailVerification", [middleware.requiresLogin], helper.simpleJSONWrapper(userController.sendEmailVerification.bind(userController)));
	app.get("/user/verify/:hash", helper.simpleJSONWrapper(userController.verify.bind(userController)));

	app.get("/auth/facebook",
		passport.authenticate("facebook", {
			display: "popup",
			scope: ["email"],
			failureRedirect: "/user/login"
		}));

	//app.get("/auth/facebook/callback", passport.authenticate("facebook"), helper.simpleHTMLWrapper(userController.callback.bind(userController)));

	app.get("/auth/google",
		passport.authenticate("google", {
			failureRedirect: "/user/login",
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email"
			]
		}));

	//app.get("/auth/google/callback", passport.authenticate("google"), helper.simpleHTMLWrapper(userController.callback.bind(userController)));

	app.get("/auth/xxx/callback", function (request) {
		var originalUrl = request.session.originalUrl || "/user/profile";
		delete request.session.originalUrl;
		response.send(html(originalUrl));
	});

	app.get("/user/sync", [middleware.requiresLogin], helper.simpleJSONWrapper(userController.sync.bind(userController)));

}