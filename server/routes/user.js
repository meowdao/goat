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
	app.post("/login", wrapJSON(::userController.login));
	app.post("/register", wrapJSON(::userController.register));
	app.post("/forgot", wrapJSON(::userController.forgot));
	app.post("/change", wrapJSON(::userController.change));
	app.get("/logout", wrapJSON(::userController.logout));
	app.post("/sendEmailVerification", requiresLogin, wrapJSON(::userController.sendEmailVerification));
	app.get("/verify/:token", wrapJSON(::userController.verify));

	app.get("/auth/facebook",
		passport.authenticate("facebook", {
			display: "popup",
			scope: ["email"],
			failureRedirect: "/login"
		}));
	app.get("/auth/facebook/callback", passport.authenticate("facebook"), (request, response) => {
		response.send(tpl);
	});

	app.get("/auth/google",
		passport.authenticate("google", {
			failureRedirect: "/login",
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
