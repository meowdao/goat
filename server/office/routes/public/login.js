import passport from "passport";
import winston from "winston";
import {Router} from "express";
import {makeError} from "../../../shared/utils/error";
import {methodNotAllowed} from "../../../shared/utils/middleware";
import {wrapJSON} from "../../../shared/utils/wrapper";
import UserController from "../../../oauth2/controllers/user";


function renderHtml(message = "") {
	return `
		<html>
			<head>
				<script>
					function handleAuth(){
						window.opener.postMessage({
							source: "oauth2",
							message: "${message.replace("\"", "\\\"")}"
						}, window.document.location);
						window.close();
					}
				</script>
			</head>
			<body onload="handleAuth();">
				If you can read this message, <br/>
				you are, probably, using old Chrome for iOS <br/>
				This browser has bug and not supported, <br/>
				please, close this window and manually refresh main site window.
			</body>
		</html>
	`;
}

const router = Router(); // eslint-disable-line new-cap

router.route("/auth/facebook")
	.get(passport.authenticate("facebook", {
		display: "popup",
		scope: [
			"email",
			"public_profile"
		]
	}))
	.all(methodNotAllowed);

router.route("/auth/google")
	.get(passport.authenticate("google", {
		scope: [
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile"
		]
	}))
	.all(methodNotAllowed);

router.route("/auth/system")
	.get(passport.authenticate("system", {
		failureRedirect: "/login",
		scope: [] // TODO check me
	}))
	.all(methodNotAllowed);

router.route("/auth/:provider(google|facebook|system)/callback")
	.get((request, response) => {
		passport.authenticate(request.params.provider, {failWithError: true})(request, response, error => {
			if (error) {
				winston.error(error);
				response.send(renderHtml(error.message));
			} else {
				response.send(renderHtml());
			}
		});
	})
	.all(methodNotAllowed);

router.route("/auth/*")
	.all((request, response, next) => {
		next(makeError("page-not-found", 404));
	});

router.route("/auth/*")
	.all((error, request, response, next) => {
		response.redirect("/login");
		next(error);
	});

router.route("/logout")
	.get(wrapJSON(UserController.logout))
	.all(methodNotAllowed);

export default router;

