import passport from "passport";
import pathport from "./pathport";
import {Strategy as LocalStrategy} from "passport-local";
import {BasicStrategy} from "passport-http";
import {Strategy as ClientPasswordStrategy} from "passport-oauth2-client-password";
import {Strategy as BearerStrategy} from "passport-http-bearer";
import winston from "winston";
import configs from "../configs/config";
import {makeError} from "../utils/error";

import UserController from "../controllers/user/user";
import ClientController from "../controllers/user/client";
import AccessTokenController from "../controllers/user/access-token";


export default function login(app) {
	const config = configs[process.env.NODE_ENV];

	pathport(app);

	/**
	 * LocalStrategy
	 *
	 * This strategy is used to authenticate users based on a email and password.
	 * Anytime a request is made to authorize an application, we must ensure that
	 * a user is logged in before asking them to approve the request.
	 */
	passport.use(new LocalStrategy(config.strategies.local,
		(email, password, callback) => {
			const userController = new UserController();
			userController.findOne({email: email.toLowerCase()}, {
				select: "+password",
				lean: false
			})
				.tap(user => {
					if (!user) {
						throw makeError("server.user-incorrect-name-or-password", user, 401);
					}
				})
				.tap(user => {
					if (!user.verifyPassword(password)) {
						throw makeError("server.user-incorrect-name-or-password", user, 401);
					}
				})
				.tap(user => {
					if (user.status !== UserController.statuses.active) {
						throw makeError("server.user-is-not-active", user, 403);
					}
				})
				.tap(user => {
					if (!user.isEmailVerified) {
						throw makeError("server.user-is-not-verified", user, 403);
					}
				})
				.tap(user => {
					user.set("password", void 0);
					callback(null, user);
				})
				.catch(callback)
				.done();
		}
	));


	/**
	 * BasicStrategy & ClientPasswordStrategy
	 *
	 * These strategies are used to authenticate registered OAuth clients.  They are
	 * employed to protect the `token` endpoint, which consumers use to obtain
	 * access tokens.  The OAuth 2.0 specification suggests that clients use the
	 * HTTP Basic scheme to authenticate.  Use of the client password strategy
	 * allows clients to send the same credentials in the request body (as opposed
	 * to the `Authorization` header).  While this approach is not recommended by
	 * the specification, in practice it is quite common.
	 */
	passport.use(new BasicStrategy(
		(clientId, clientSecret, callback) => {
			const clientController = new ClientController();
			clientController.findOne({clientId})
				.tap(client => {
					if (!client) {
						throw new Error("client not found");
					}
				})
				.tap(client => {
					if (client.clientSecret !== clientSecret) {
						throw new Error("secret don't match");
					}
				})
				.tap(client =>
					callback(null, client)
				)
				.catch(callback)
				.done();
		}
	));

	passport.use(new ClientPasswordStrategy(
		(clientId, clientSecret, callback) => {
			const clientController = new ClientController();
			clientController.findOne({clientId})
				.tap(client => {
					if (!client) {
						throw new Error("client not found");
					}
				})
				.tap(client => {
					if (client.clientSecret !== clientSecret) {
						throw new Error("secret don't match");
					}
				})
				.tap(client =>
					callback(null, client)
				)
				.catch(e => {
					winston.notice(e);
					callback(null, false);
				})
				.done();
		}
	));

	/**
	 * BearerStrategy
	 *
	 * This strategy is used to authenticate users based on an access token (aka a
	 * bearer token).  The user must have previously authorized a client
	 * application, which is issued an access token to make requests on behalf of
	 * the authorizing user.
	 */
	passport.use(new BearerStrategy(
		(accessToken, callback) => {
			const accessTokenController = new AccessTokenController();
			accessTokenController.findOne({accessToken})
				.tap(token => {
					if (!token) {
						throw new Error("token not found");
					}
				})
				.tap(token => {
					const userController = new UserController();
					return userController.findById(token.userId)
						.tap(user => {
							if (!user) {
								throw new Error("user not found");
							}
						})
						.tap(user => {
							// to keep this example simple, restricted scopes are not implemented,
							// and this is just for illustrative purposes
							const info = {scope: "*"};
							callback(null, user, info);
						});
				})
				.catch(e => {
					winston.notice(e);
					callback(null, false);
				})
				.done();
		}
	));
}
