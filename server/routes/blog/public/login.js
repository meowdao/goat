import passport from "passport";
import {makeError, processValidationError} from "../../../utils/error";
import {methodNotAllowed} from "../../utils";


function successHtml() {
	return `
		<html>
			<head>
				<script>
		            window.onunload = function() {
		                window.opener.location = "/";
		            };
					setTimeout(function(){
						window.close();
					}, 100)
				</script>
			</head>
			<body></body>
		</html>
	`;
}

function errorHtml(message) {
	return `
		<html>
		    <head>
		        <script>
		            window.onunload = function() {
		                window.opener.postMessage("${message}", window.document.location);
		            };
					setTimeout(function(){
						window.close();
					}, 100)
		        </script>
		    </head>
		    <body></body>
		</html>
	`;
}

export default function (router) {
	router.route("/auth/facebook")
		.get(passport.authenticate("facebook", {
			display: "popup",
			scope: ["email"],
			failureRedirect: "/login"
		}))
		.all(methodNotAllowed);

	router.route("/auth/google")
		.get(passport.authenticate("google", {
			failureRedirect: "/login",
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email"
			]
		}))
		.all(methodNotAllowed);

	router.route("/auth/goat")
		.get(passport.authenticate("goat", {
				failureRedirect: "/login",
				scope: [] // TODO check me
			}))
		.all(methodNotAllowed);

	router.route("/auth/:provider(google|facebook|goat)/callback")
		.get((request, response) => {
			passport.authenticate(request.params.provider)(request, response, () => {
				response.send(successHtml());
			});
		})
		.all(methodNotAllowed);

	router.route("/auth/:provider(google|facebook|goat)/callback")
		.all((error, request, response, next) => {
			void next;
			response.send(errorHtml(error.name === "ValidationError" ? processValidationError(error).join(", ") : error.message));
		});

	router.route("/auth/*")
		.all((request, response, next) => {
			next(makeError("server.page-not-found", request.user, 404));
		});

	router.route("/auth/*")
		.all((error, request, response, next) => {
			response.redirect("/login");
			next(error);
		});

	router.route("/logout")
		.get((request, response) => {
			request.logout();
			response.clearCookie();
			response.send({success: true});
		})
		.all(methodNotAllowed);
}
