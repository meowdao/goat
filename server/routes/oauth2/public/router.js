import passport from "passport";
import login from "connect-ensure-login";
import server from "../../../utils/oauth2";

import ClientController from "../../../controllers/user/client";
import AuthorizationCodeController from "../../../controllers/user/authorization-code";


export default function (router) {
	router.route("/login")
		.post(passport.authenticate("local", {successReturnToOrRedirect: "/", failureRedirect: "/error"}));

	router.route("/logout")
		.get((request, response) => {
			request.logout();
			response.clearCookie();
			response.redirect("/login");
		});

	router.route("/account")
		.get(login.ensureLoggedIn(), (request, response) => {
			response.render("account", {user: request.user});
		});

	// user authorization endpoint
	//
	// `authorization` middleware accepts a `validate` callback which is
	// responsible for validating the client making the authorization request.  In
	// doing so, is recommended that the `redirectURI` be checked against a
	// registered value, although security requirements may vary accross
	// implementations.  Once validated, the `done` callback must be invoked with
	// a `client` instance, as well as the `redirectURI` to which the user will be
	// redirected after an authorization decision is obtained.
	//
	// This middleware simply initializes a new authorization transaction.  It is
	// the application"s responsibility to authenticate the user and render a dialog
	// to obtain their approval (displaying details about the client requesting
	// authorization).  We accomplish that here by routing through `ensureLoggedIn()`
	// first, and rendering the `dialog` view.
	router.route("/dialog/authorize")
		.get(login.ensureLoggedIn(),
			server.authorization((clientId, redirectURI, callback) => {
				const clientController = new ClientController();
				clientController.findOne({clientId})
					.tap(client => {
						if (!client.redirectURIs.includes(redirectURI)) {
							throw new Error("redirectURI is not not in list");
						}
						callback(null, client, redirectURI);
					})
					.catch(callback);
			}, (client, user, callback) => {
				const authorizationCodeController = new AuthorizationCodeController();
				authorizationCodeController.find({
					clientId: client.clientId,
					userId: user._id
				})
					.then(authCode => {
						callback(null, !!authCode);
					})
					.catch(callback);
			}),
			(request, response) => {
				response.render("dialog", {
					transaction: request.oauth2.transactionID,
					user: request.user,
					client: request.oauth2.client
				});
			});

	// user decision endpoint
	//
	// `decision` middleware processes a user"s decision to allow or deny access
	// requested by a client application.  Based on the grant type requested by the
	// client, the above grant middleware configured above will be invoked to send
	// a response.
	router.route("/dialog/authorize/decision")
		.post(login.ensureLoggedIn(),
			server.decision());


	// token endpoint
	//
	// `token` middleware handles client requests to exchange authorization grants
	// for access tokens.  Based on the grant type being exchanged, the above
	// exchange middleware will be invoked to handle the request.  Clients must
	// authenticate when making requests to this endpoint.
	router.route("/oauth/token")
		.post(passport.authenticate(["basic", "oauth2-client-password"], {session: false}),
			server.token(),
			server.errorHandler());

	router.route("/api/userinfo")
		.get(passport.authenticate("bearer", {session: false}), (request, response) => {
				// request.authInfo is set using the `info` argument supplied by
				// `BearerStrategy`.  It is typically used to indicate scope of the token,
				// and used in access control checks.  For illustrative purposes, this
				// example simply returns the scope in the response.
				response.json({
					id: request.user._id,
					email: request.user.email,
					name: request.user.fullName,
					scope: request.authInfo.scope
				});
			}
		);
}
