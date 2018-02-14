import oauth2orize from "oauth2orize";
import winston from "winston";

import ClientController from "../controllers/client";
import AuthorizationCodeController from "../controllers/authorization-code";
import AccessTokenController from "../controllers/access-token";


// create OAuth 2.0 server
const server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user  must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client"s ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient((client, done) =>
	done(null, client._id)
);

server.deserializeClient((_id, callback) => {
	const clientController = new ClientController();
	clientController.findById(_id)
		.then(user => {
			callback(null, user);
		})
		.catch(error => {
			callback(error, null);
		})
		.done();
});

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectURI` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code((client, redirectURI, user, ares, callback) => {
	const authorizationCodeController = new AuthorizationCodeController();
	authorizationCodeController.create({
		clientId: client.clientId,
		redirectURI,
		userId: user.id
	})
		.tap(authCode => {
			callback(null, authCode.code);
		})
		.catch(callback)
		.done();
}));

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(oauth2orize.exchange.code((client, code, redirectURI, callback) => {
	const authorizationCodeController = new AuthorizationCodeController();
	authorizationCodeController.findOne({code})
		.tap(authCode => {
			if (!authCode) {
				throw new Error("auth code not found");
			}
		})
		.tap(authCode => {
			if (client.clientId !== authCode.clientId) {
				throw new Error("client id don't match");
			}
		})
		.tap(authCode => {
			if (redirectURI !== authCode.redirectURI) {
				throw new Error("redirect URI don't match");
			}
		})
		.tap(authCode => {
			const accessTokenController = new AccessTokenController();
			return accessTokenController.create({
				userId: authCode.userId,
				clientId: authCode.clientId
			})
				.tap(accessToken => {
					callback(null, accessToken.accessToken);
				});
		})
		.catch(e => {
			winston.notice(e);
			callback(null, false);
		})
		.done();
}));

export default server;
