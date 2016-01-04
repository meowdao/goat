"use strict";

import passport from "passport";
import helper from "../utils/helper.js";
import middleware from "../utils/middleware.js";
import UserController from "../controllers/user.js";


const tpl = `
<html>
	<head>
	    <script>
	        window.opener.location = "/";
	        window.close();
	    </script>
	</head>
	<body></body>
</html>
`;

export default function(app) {

	const userController = new UserController();

	// user routes
	app.post("/user/login", helper.simpleJSONWrapper(::userController.login));
	app.post("/user/register", helper.simpleJSONWrapper(::userController.register));
	app.post("/user/forgot", helper.simpleJSONWrapper(::userController.forgot));
	app.post("/user/change", helper.simpleJSONWrapper(::userController.change));
	app.get("/user/logout", ::userController.logout);
	app.post("/user/sendEmailVerification", middleware.requiresLogin(), helper.simpleJSONWrapper(::userController.sendEmailVerification));
	app.get("/user/verify/:token", helper.simpleJSONWrapper(::userController.verify));

	app.get("/auth/facebook",
		passport.authenticate("facebook", {
			display: "popup",
			scope: ["email"],
			failureRedirect: "/user/login"
		}));
	app.get("/auth/facebook/callback", passport.authenticate("facebook"), (request, response) => {
		response.send(tpl);
	});

	app.get("/auth/google",
		passport.authenticate("google", {
			failureRedirect: "/user/login",
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email"
			]
		}));
	app.get("/auth/google/callback", passport.authenticate("google"), (request, response) => {
		response.send(tpl);
	});

	app.get("/user/sync", middleware.requiresLogin(), helper.simpleJSONWrapper(::userController.sync));

}
