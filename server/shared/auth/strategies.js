import passport from "passport";
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import {Strategy as FacebookStrategy} from "passport-facebook";
import SystemStrategy from "./system-strategy";
import configs from "../../shared/configs/config";
import {getRandomString} from "../utils/misc";
import {makeError} from "../utils/error";

import UserController from "../../oauth2/controllers/user";


const config = configs[process.env.NODE_ENV];

function createUser(provider, profile) {
	const random = getRandomString(16);
	const userController = new UserController();
	return userController.insert({
		params: {
			isEmailVerified: true
		},
		body: {
			email: profile.emails[0].value,
			fullName: profile.displayName || `${profile.name.givenName} ${profile.name.familyName}`,
			image: profile.photos[0].value,
			language: profile._json.language || profile._json.locale.split("_")[0],
			confirm: random,
			password: random,
			social: {
				[provider]: profile.id
			}
		}
	});
}

function getUser(provider, profile) {
	const userController = new UserController();
	return userController.findOne({
		$or: [
			{[`social.${provider}`]: profile.id},
			{email: profile.emails[0].value}
		]
	}, {lean: false})
		.then(user => {
			if (user) {
				if (user.social[provider] === profile.id) {
					return user;
				} else {
					Object.assign(user.social, {[provider]: profile.id});
					return userController.save(user);
				}
			} else if (config.createUser) {
				return createUser(provider, profile);
			} else {
				throw makeError("access-denied", 403, {reason: "permissions"});
			}
		});
}

if ("google" in config.strategies) {
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

if ("facebook" in config.strategies) {
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

if ("system" in config.strategies) {
	passport.use(new SystemStrategy(config.strategies.system,
		(accessToken, refreshToken, profile, callback) => {
			getUser("system", profile)
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

