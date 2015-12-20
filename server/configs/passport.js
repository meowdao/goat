"use strict";

import debug from "debug";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {Strategy as FacebookStrategy} from "passport-facebook";
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import configs from "./config.js";
import UserController from "../controllers/user.js";


export default function (app) {

	const config = configs[process.env.NODE_ENV];

	let log = debug("log:passport");

	passport.serializeUser(function (user, callback) {
		callback(null, user._id);
	});

	passport.deserializeUser(function (id, callback) {
		let userController = new UserController();
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
		function (email, password, callback) {
			let userController = new UserController();
			userController.findOne({email: email}, {
					select: "+password",
					lean: false
				})
				.then(user => {
					if (user) {
						if (user.verifyPassword(password)) {
							callback(null, user);
						} else {
							callback(null, false, {message: "incorrect-password"});
						}
					} else {
						callback(null, false, {message: "incorrect-name"});
					}
				})
				.catch(error => {
					callback(error, null);
				})
				.done();
		}
	));


	passport.use(new GoogleStrategy(config.strategies.google,
		function (accessToken, refreshToken, profile, callback) {
			log("google:profile", profile);
			let userController = new UserController();
			userController.findOne({"google.id": profile.id}, {lean: false})
				.then(user => {
					if (!user) {
						userController.create({
								firstName: profile.name.givenName,
								lastName: profile.name.familyName,
								email: profile.emails[0].value,
								isEmailVerified: true,
								google: profile._json
							})
							.then(user => {
								callback(null, user);
							})
							.catch(error => {
								callback(error, null);
							})
							.done();
					} else {
						callback(null, user);
					}
				})
				.catch(error => {
					callback(error, null);
				})
				.done();
		}
	));

	passport.use(new FacebookStrategy(config.strategies.facebook,
		function (accessToken, refreshToken, profile, callback) {
			log("facebook:profile", profile);
			let userController = new UserController();
			userController.findOne({"facebook.id": profile.id}, {lean: false})
				.then(user => {
					if (!user) {
						userController.create({
								firstName: profile.name.givenName,
								lastName: profile.name.familyName,
								email: profile.emails[0].value,
								isEmailVerified: true,
								facebook: profile._json
							})
							.then(user => {
								callback(null, user);
							})
							.catch(error => {
								callback(error, null);
							})
							.done();
					} else {
						callback(null, user);
					}
				})
				.catch(error => {
					callback(error, null);
				})
				.done();
		}
	));

	app.use(passport.initialize());
	app.use(passport.session());

}
