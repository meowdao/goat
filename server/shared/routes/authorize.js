import login from "connect-ensure-login";
import server from "../../oauth2/utils/oauth2";
import {Router} from "express";

import ClientController from "../../oauth2/controllers/client";
import AuthorizationCodeController from "../../oauth2/controllers/authorization-code";


const router = Router(); // eslint-disable-line new-cap


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
router.route("/authorize")
	.get(login.ensureLoggedIn(),
		server.authorization((clientId, redirectURI, callback) => {
			const clientController = new ClientController();
			clientController.findOne({clientId})
				.tap(client => {
					if (!client) {
						throw new Error("client not found");
					}
					if (!client.redirectURIs.includes(redirectURI)) {
						throw new Error("redirectURI is not not in list");
					}
					callback(null, client, redirectURI);
				})
				.catch(callback);
		}, (client, user, callback) => {
			const authorizationCodeController = new AuthorizationCodeController();
			authorizationCodeController.findOne({
				clientId: client.clientId,
				userId: user._id
			})
				.then(authCode => {
					callback(null, !!authCode);
				})
				.catch(callback);
		}));

export default router;
