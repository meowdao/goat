"use strict";

import q from "q";
import passport from "passport";
import {reEmail} from "../../utils/constants/regexp.js";
import {translate} from "../../utils/lang.js";

import {makeError, checkModel} from "../../utils/messenger.js";
import AbstractController from "./abstract.js";
import MailController from "./../mail.js";
import HashController from "./../hash.js";

export default class AbstractUserController extends AbstractController {

	login(request, response) {
		const defer = q.defer();

		passport.authenticate("local", {badRequestMessage: "missing-credentials"}, (error, user, info) => {
			defer.makeNodeResolver()(error || info, user);
		})(request, response);

		return defer.promise
			.catch(error => {
				throw makeError(error.message, request.user, 401);
			});
	}

	register(request) {
		return this.create(request.body)
			.tap(user => q.nbind(request.login, request)(user))
			.tap(() => this.sendEmailVerification(request));
	}

	forgot(request) {
		return this.findOne({email: request.body.email})
			.tap(checkModel().bind(this))
			.tap(user => {
				const hashController = new HashController();
				return hashController
					.upsert({
						user: user._id,
						type: HashController.types.password
					})
					.then(hash => {
						const mailController = new MailController();
						return mailController.composeMail("user/forgot", {to: user.email}, user, {
							hash
						});
					});
			})
			.then(user => ({
				success: true,
				message: translate("messages/instructions-sent", user)
			}));
	}

	change(request) {
		const hashController = new HashController();
		return hashController
			.findOneAndRemove({
				token: request.body.token,
				type: HashController.types.password
			})
			.then(checkModel().bind(hashController))
			.then(hash => {
				return this.findById(hash.user, {lean: false})
					.then(user => {
						request.user = user;
						return this.editPassword(request);
					});
			})
			.then(user => ({
				success: true,
				message: translate("messages/password-changed", user)
			}));
	}

	sendEmailVerification(request) {
		const hashController = new HashController();
		return hashController
			.create({
				user: request.user._id,
				type: HashController.types.email
			})
			.then(hash => {
				const mailController = new MailController();
				return mailController.composeMail("user/verify", {to: request.user.email}, request.user, {
					hash
				});
			})
			.thenResolve({success: true});
	}

	editPassword(request) {
		request.user.password = request.body.password;
		request.user.confirm = request.body.confirm;

		return this.save(request.user)
			.then(user => q.nbind(request.login, request)(user))
			.thenResolve({success: true});
	}

	verify(request) {
		const hashController = new HashController();
		return hashController
			.findOneAndRemove({
				type: HashController.types.email,
				token: request.params.token
			})
			.then(checkModel().bind(hashController))
			.then(hash => {
				return this.findByIdAndUpdate(hash.user, {isEmailVerified: true});
			})
			.thenResolve({success: true});
	}

	checkEmail(request) {
		return this.count({email: request.params.email})
			.then(count => {
				return {
					unique: !count,
					valid: reEmail.test(request.params.email)
				};
			});
	}

	checkPhoneNumber(request) {
		return this.count({email: request.params.email})
			.then(count => {
				return {
					unique: !count,
					valid: reEmail.test(request.params.email)
				};
			});
	}

	logout(request, response) {
		request.logout();
		request.session.logout = true;
		response.clearCookie();
		response.status(204).send("");
	}
}
