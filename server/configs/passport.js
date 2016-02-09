"use strict";

import debug from "debug";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {Strategy as FacebookStrategy} from "passport-facebook";
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import configs from "./config.js";
import UserController from "../controllers/user.js";
import {makeError} from "../utils/messenger.js";


export default function (app) {
	const config = configs[process.env.NODE_ENV];
	const log = debug("log:passport");

	passport.serializeUser((user, callback) => {
		callback(null, user._id);
	});

	passport.deserializeUser((id, callback) => {
		const userController = new UserController();
		userController.findById(id, {lean: false})
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
			userController
				.findOne({email}, {
					select: "+password",
					lean: false
				})
				.tap(user => {
					if (!user) {
						throw makeError("incorrect-name", user, 401);
					}
				})
				.tap(user => {
					if (!user.verifyPassword(password)) {
						throw makeError("incorrect-password", user, 401);
					}
				})
				.tap(user => {
					if (!user.isEmailVerified) {
						throw makeError("verify-email", user, 401);
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

	if (config.strategies.google.clientID) {
		passport.use(new GoogleStrategy(config.strategies.google,
			(accessToken, refreshToken, profile, callback) => {
				log("google:profile", profile);
				const userController = new UserController();
				userController.findOne({"google.id": profile.id}, {lean: false})
					.then(user => {
						if (!user) {
							return userController
								.create({
									firstName: profile.name.givenName,
									lastName: profile.name.familyName,
									email: profile.emails[0].value,
									isEmailVerified: true,
									google: profile._json
								})
								.then(newUser => {
									callback(null, newUser);
								})
								.catch(error => {
									callback(error, null);
								})
								.done();
						} else {
							callback(null, user);
						}
					})
					.catch(callback)
					.done();
			}
		));
	}

	if (config.strategies.facebook.clientID) {
		passport.use(new FacebookStrategy(config.strategies.facebook,
			(accessToken, refreshToken, profile, callback) => {
				log("facebook:profile", profile);
				const userController = new UserController();
				userController.findOne({"facebook.id": profile.id}, {lean: false})
					.then(user => {
						if (!user) {
							return userController
								.create({
									firstName: profile.name.givenName,
									lastName: profile.name.familyName,
									email: profile.emails[0].value,
									isEmailVerified: true,
									facebook: profile._json
								})
								.then(newUser => {
									callback(null, newUser);
								})
								.catch(error => {
									callback(error, null);
								})
								.done();
						} else {
							callback(null, user);
						}
					})
					.catch(callback)
					.done();
			}
		));
	}

	app.use(passport.initialize());
	app.use(passport.session());
}
