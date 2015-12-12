"use strict";

import debug from "debug";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
//import {Strategy as FacebookStrategy} from "passport-facebook";
//import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
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
			userController.findOne({email: email}, {lean: false})
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

	/*
	passport.use(new GoogleStrategy(config.strategies.google,
		function (accessToken, refreshToken, profile, callback) {
			let userController = new UserController();
			userController.findOne({"google.id": profile.id}, {lean: false})
				.then(user => {
					if (!user) {
						userController.create({
							email: profile.emails[0].value,
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
			let userController = new UserController();
			userController.findOne({"facebook.id": profile.id}, {lean: false})
				.then(user => {
					if (!user) {
						userController.create({
							first_name: profile.name.givenName,
							last_name: profile.name.familyName,
							email: profile.emails[0].value,
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
	*/

	app.use(passport.initialize());
	app.use(passport.session());

}
