"use strict";

import Q from "q";
import _ from "lodash";
import mongoose from "mongoose";
import passport from "passport";

import messenger from "../utils/messenger.js";
import AbstractController from "../utils/abstractController.js";
import MailController from "./mail.js";
import HashController from "./hash.js";

class AbstractUserController extends AbstractController {

	login(request, response) {
		var defer = Q.defer();

		passport.authenticate("local", {badRequestMessage: "missing-credentials"}, function (error, user, info) {
			defer.makeNodeResolver()(error || info, user);
		})(request, response);

		return defer.promise
			.catch(error => {
				throw messenger.makeError(error.message, request.user);
			});
	}

	register(request) {
		return this.create(request.body)
			.then(user => {
				return Q.nbind(request.login, request)(user)
					.then(() => {
						return this.sendEmailVerification(request);
					});
			});
	}

	forgot(request) {
		var clean = _.pick(request.body, ["email"]);
		return this.findOne(clean)
			.then(messenger.checkModel("user-not-found"))
			.then(user => {
				let hashController = new HashController();
				return hashController.create({user: user._id})
					.then(hash => {
						let mailController = new MailController();
						return mailController.composeMail("user/remind", {to: user.email}, user, {
							hash: hash
						});
					});
			})
			.thenResolve({
				messages: ["Email was sent"]
			});
	}

	change(request) {
		let hashController = new HashController();
		return hashController.findByIdAndRemove(request.params.hash)
			.then(messenger.checkModel("expired-key"))
			.then(hash => {
				return this.findById(hash.user, {lean: false})
					.then(user => {
						user.password = request.body.password;
						user.confirm = request.body.confirm;
						return this.save(user);
					});
			})
			.thenResolve({
				messages: ["Now you can login with your new password"]
			});
	}

	sendEmailVerification(request) {
		let hashController = new HashController();
		return hashController.create({user: request.user._id})
			.then(hash => {
				let mailController = new HashController();
				return mailController.composeMail("user/verify", {to: request.user.email}, request.user, {
					hash: hash
				});
			})
			.thenResolve({
				messages: ["Verification email was sent to " + request.user.email]
			});
	}

	verify(request) {
		let hashController = new HashController();
		return hashController.findByIdAndRemove(request.params.hash)
			.then(hash => {
				return this.findById(hash.user, {lean: false})
					.then(user => {
						user.email_verified = true;
						return this.save(user);
					});
			})
			.thenResolve({
				messages: ["Email is verified"]
			});
	}

	logout(request, response) {
		request.logout();
		request.session.logout = true;
		response.clearCookie();
		response.redirect("user/login");
	}
}

export default AbstractUserController;
