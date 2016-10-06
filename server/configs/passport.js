import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import {Strategy as FacebookStrategy} from "passport-facebook";
import configs from "./config";
import {makeError} from "../utils/messenger";

import UserController from "../controllers/user/user";


export default function login(app) {
	const config = configs[process.env.NODE_ENV];

	passport.serializeUser((user, callback) => {
		callback(null, user._id);
	});

	passport.deserializeUser((_id, callback) => {
		const userController = new UserController();
		userController.getByQuery({_id})
			.then(user => {
				callback(null, user);
			})
			.catch(error => {
				callback(error, null);
			})
			.done();
	});

	passport.use(new LocalStrategy(config.strategies.local,
		(email, password, callback) => {
			const userController = new UserController();
			userController.findOne({email: email.toLowerCase()}, {
				select: "+password",
				lean: false
			})
				.tap(user => {
					if (!user) {
						throw makeError("server.user-incorrect-name", user, 401);
					}
				})
				.tap(user => {
					if (!user.verifyPassword(password)) {
						throw makeError("server.user-incorrect-password", user, 401);
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

	function getUser(provider, profile) {
		const userController = new UserController();
		return userController.getByQuery({[`${provider}.id`]: profile.id})
			.then(administrator => {
				if (administrator) {
					return administrator;
				} else {
					return userController.getByQuery({email: profile.emails[0].value.toLowerCase()})
						.then(user => {
							if (user) {
								user.set(provider, profile._json);
								return userController.save(user);
							} else {
								if (config.permissions.autoCreate) {
									return userController.create({
										fullName: `${profile.name.givenName} ${profile.name.familyName}`,
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

	app.use(passport.initialize());
	app.use(passport.session());
}
