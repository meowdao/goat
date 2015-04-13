"use strict";

import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
//import {Strategy as FacebookStrategy} from "passport-facebook";
//import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import UserController from "../controllers/user.js";
import configs from "./config.js";

var config = configs[process.env.NODE_ENV];
var userController = new UserController();

// http://passportjs.org/guide/profile/

passport.serializeUser(function (user, callback) {
	callback(null, user._id);
});

passport.deserializeUser(function (id, callback) {
	userController.findOne({_id: id}, {lean: false})
		.then((user) => {
			callback(null, user);
		})
		.fail((error)=> {
			callback(error, null);
		})
		.done();
});

// use local strategy
passport.use(new LocalStrategy(config.passport.local,
	function (email, password, callback) {
		userController.findOne({email: email}, {lean: false})
			.then((user) => {
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
			.fail((error) => {
				callback(error, null);
			})
			.done();
	}
));

/*
passport.use(new FacebookStrategy(config.passport.facebook,
	function (accessToken, refreshToken, profile, callback) {
		userController.findOne({"facebook.id": profile.id}, {lean: false})
			.then((user) => {
				if (!user) {
					userController.create({
						first_name: profile.name.givenName,
						last_name: profile.name.familyName,
						email: profile.emails[0].value,
						facebook: profile._json
					})
						.then((user) => {
							callback(null, user);
						})
						.fail((error) => {
							callback(error, null);
						})
						.done();
				} else {
					callback(null, user);
				}
			})
			.fail((error) => {
				callback(error, null);
			})
			.done();
	}
));

passport.use(new GoogleStrategy(config.passport.google,
	function (accessToken, refreshToken, profile, callback) {
		userController.findOne({"google.id": profile.id}, {lean: false})
			.then((user) => {
				if (!user) {
					userController.create({
						first_name: profile.name.givenName,
						last_name: profile.name.familyName,
						email: profile.emails[0].value,
						google: profile._json
					})
						.then((user) => {
							callback(null, user);
						})
						.fail((error) => {
							callback(error, null);
						})
						.done();
				} else {
					callback(null, user);
				}
			})
			.fail((error) => {
				callback(error, null);
			})
			.done();
	}
));
*/

export default passport;