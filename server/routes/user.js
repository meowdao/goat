"use strict";

import passport from "passport";
import {simpleJSONWrapper} from "../utils/helper.js";
import {requiresLogin} from "../utils/middleware.js";
import UserController from "../controllers/user.js";


const tpl = `
<html>
	<head>
		<script>
			setTimeout(function(){
				window.close();
			}, 100)
		</script>
	</head>
	<body></body>
</html>
`;

export default function (app) {
	const userController = new UserController();

	// user routes
	app.post("/user/login", simpleJSONWrapper(::userController.login));
	app.post("/user/register", simpleJSONWrapper(::userController.register));
	app.post("/user/forgot", simpleJSONWrapper(::userController.forgot));
	app.post("/user/change", simpleJSONWrapper(::userController.change));
	app.get("/user/logout", ::userController.logout);
	app.post("/user/sendEmailVerification", requiresLogin, simpleJSONWrapper(::userController.sendEmailVerification));
	app.get("/user/verify/:token", simpleJSONWrapper(::userController.verify));

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

	app.get("/user/sync", requiresLogin, simpleJSONWrapper(::userController.sync));
}
