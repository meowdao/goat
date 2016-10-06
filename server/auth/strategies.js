import passport from "passport";
import pathport from "./pathport";
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import {Strategy as FacebookStrategy} from "passport-facebook";
import GOATStrategy from "./goat-strategy";
import configs from "../configs/config";
import {makeError} from "../utils/error";
import {getRandomString} from "../utils/misc";

import UserController from "../controllers/user/user";


export default function login(app) {
	const config = configs[process.env.NODE_ENV];

	pathport(app);

	function getUser(provider, profile) {
		const userController = new UserController();
		return userController.getByQuery({[`${provider}.id`]: profile.id})
			.then(user => {
				if (user) {
					return user;
				} else {
					return userController.getByQuery({email: profile.emails[0].value.toLowerCase()})
						.then(user => {
							if (user) {
								user.set(provider, profile._json);
								return userController.save(user);
							} else {
								if (config.permissions.autoCreate) {
									const random = getRandomString(16);
									return userController.create({
										password: random,
										confirm: random,
										fullName: profile.displayName,
										email: profile.emails[0].value,
										isEmailVerified: true,
										[provider]: profile._json
									});
								} else {
									throw makeError("server.user-profile-not-found", user, 401);
								}
							}
						});
				}
			});
	}

	if (config.strategies.google.clientID) {
		passport.use(new GoogleStrategy(config.strategies.google,
			(accessToken, refreshToken, profile, callback) => {
				getUser("google", profile)
					.tap(user => {
						callback(null, user);
					})
					.catch(error => {
						callback(error, null);
					})
					.done();
			}
		));
	}

	if (config.strategies.facebook.clientID) {
		passport.use(new FacebookStrategy(config.strategies.facebook,
			(accessToken, refreshToken, profile, callback) => {
				getUser("facebook", profile)
					.tap(user => {
						callback(null, user);
					})
					.catch(error => {
						callback(error, null);
					})
					.done();
			}
		));
	}

	if (config.strategies.goat.clientID) {
		passport.use(new GOATStrategy(config.strategies.goat,
			(accessToken, refreshToken, profile, callback) => {
				getUser("abl", profile)
					.tap(user => {
						callback(null, user);
					})
					.catch(error => {
						callback(error, null);
					})
					.done();
			}
		));
	}
}
