"use strict";

import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
//import {Strategy as FacebookStrategy} from "passport-facebook";
//import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import UserController from "../controllers/user.js";
import configs from "./config.js";

var config = configs[process.env.NODE_ENV];

// http://passportjs.org/guide/profile/

passport.serializeUser(function (user, callback) {
	callback(null, user._id);
});

passport.deserializeUser(function (id, callback) {
	UserController.findOne({_id: id}, {lean: false})
		.then(function (user) {
			callback(null, user);
		})
		.fail(function (error) {
			callback(error, null);
		})
		.done();
});

// use local strategy
passport.use(new LocalStrategy(config.passport.local,
	function (email, password, callback) {
		UserController.findOne({email: email}, {
			select: "+salt +hashed_password",
			lean: false
		})
			.then(function (user) {
				if (!user || !user.authenticate(password)) {
					callback(null, false, {message: "Invalid user name or password"});
				} else {
					callback(null, user);
				}
			})
			.fail(function (error) {
				callback(error, null);
			})
			.done();
	}
));

/*
passport.use(new FacebookStrategy(config.passport.facebook,
	function (accessToken, refreshToken, profile, callback) {
		UserController.findOne({"facebook.id": profile.id}, {lean: false})
			.then(function (user) {
				if (!user) {
					UserController.insert({
						first_name: profile.name.givenName,
						last_name: profile.name.familyName,
						email: profile.emails[0].value,
						facebook: profile._json
					})
						.then(function (user) {
							callback(null, user);
						})
						.fail(function (error) {
							callback(error, null);
						})
						.done();
				} else {
					callback(null, user);
				}
			})
			.fail(function (error) {
				callback(error, null);
			})
			.done();
	}
));

passport.use(new GoogleStrategy(config.passport.google,
	function (accessToken, refreshToken, profile, callback) {
		UserController.findOne({"google.id": profile.id}, {lean: false})
			.then(function (user) {
				if (!user) {
					UserController.insert({
						first_name: profile.name.givenName,
						last_name: profile.name.familyName,
						email: profile.emails[0].value,
						google: profile._json
					})
						.then(function (user) {
							callback(null, user);
						})
						.fail(function (error) {
							callback(error, null);
						})
						.done();
				} else {
					callback(null, user);
				}
			})
			.fail(function (error) {
				callback(error, null);
			})
			.done();
	}
));
*/

export default passport;