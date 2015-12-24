"use strict";

import q from "q";
import _ from "lodash";
import passport from "passport";

import messenger from "../../utils/messenger.js";
import AbstractController from "./abstract.js";
import MailController from "./../mail.js";
import HashController from "./../hash.js";

export default class AbstractUserController extends AbstractController {

	login(request, response) {
		var defer = q.defer();

		passport.authenticate("local", {badRequestMessage: "missing-credentials"}, function (error, user, info) {
			defer.makeNodeResolver()(error || info, user);
		})(request, response);

		return defer.promise
			.catch(error => {
				throw messenger.makeError(error.message, request.user, 401);
			});
	}

	register(request) {

		return this.create(request.body)
			.tap(user => {
				return q.nbind(request.login, request)(user);
			})
			.tap(() => {
				return this.sendEmailVerification(request);
			});
	}

	forgot(request) {
		var clean = _.pick(request.body, ["email"]);
		return this.findOne(clean)
			.then(messenger.notFound(this, request.user))
			.then(user => {
				const hashController = new HashController();
				return hashController.upsert({user: user._id, type: "password"})
					.then(hash => {
						const mailController = new MailController();
						return mailController.composeMail("user/forgot", {to: user.email}, user, {
							hash: hash
						});
					});
			}).thenResolve({success: true});
	}

	change(request) {
		const hashController = new HashController();
		return hashController.findByIdAndRemove(request.body.hash)
			.then(messenger.notFound(hashController, null))
			.then(hash => {
				return this.findById(hash.user, {lean: false})
					.then(user => {
						user.password = request.body.password;
						user.confirm = request.body.confirm;
						return this.save(user);
					});
			}).thenResolve({success: true});
	}

	sendEmailVerification(request) {
		const hashController = new HashController();
		return hashController.create({user: request.user._id})
			.then(hash => {
				const mailController = new MailController();
				return mailController.composeMail("user/verify", {to: request.user.email}, request.user, {
					hash: hash
				});
			}).thenResolve({success: true});
	}

	verify(request) {
		const hashController = new HashController();
		return hashController.findByIdAndRemove(request.params.hash)
			.then(hash => {
				return this.findById(hash.user, {lean: false})
					.then(user => {
						user.email_verified = true;
						return this.save(user);
					});
			}).thenResolve({success: true});
	}

	logout(request, response) {
		request.logout();
		request.session.logout = true;
		response.clearCookie();
		response.status(204).send("");
	}
}

