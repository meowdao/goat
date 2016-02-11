"use strict";

import passport from "passport";
import {wrapJSON} from "../utils/helper";
import {requiresLogin} from "../utils/middleware";
import UserController from "../controllers/user";


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
	app.post("/user/login", wrapJSON(::userController.login));
	app.post("/user/register", wrapJSON(::userController.register));
	app.post("/user/forgot", wrapJSON(::userController.forgot));
	app.post("/user/change", wrapJSON(::userController.change));
	app.get("/user/logout", wrapJSON(::userController.logout));
	app.post("/user/sendEmailVerification", requiresLogin, wrapJSON(::userController.sendEmailVerification));
	app.get("/user/verify/:token", wrapJSON(::userController.verify));

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

	app.get("/user/sync", requiresLogin, wrapJSON(::userController.sync));
}
