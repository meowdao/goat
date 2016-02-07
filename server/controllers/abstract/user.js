"use strict";

import q from "q";
import _ from "lodash";
import passport from "passport";
import {reEmail} from "../../utils/constants/regexp.js";
import {translate} from "../../utils/lang.js";

import {makeError, checkModel} from "../../utils/messenger.js";
import AbstractController from "./abstract.js";
import MailController from "../mail.js";
import HashController from "../hash.js";

export default class AbstractUserController extends AbstractController {

	login(request, response) {
		const defer = q.defer();
		passport.authenticate("local", {badRequestMessage: "missing-credentials"}, (error, user, info) => {
			defer.makeNodeResolver()(error || info && makeError(info.message, request.user, 401), user);
		})(request, response);

		return defer.promise
			.then(user => {
				return this.sessionChange(request, user);
			})
			.catch(error => {
				this.logout(request, response).done();
				throw error;
			});
	}

	// change the session for users who logged in
	sessionChange(request, user) {
		const defer = q.defer();
		request.logIn(user, error1 => {
			if (error1) {
				defer.makeNodeResolver()(error1);
				return;
			}
			const temp = request.session.passport;
			request.session.regenerate(error2 => {
				if (error2) {
					defer.makeNodeResolver()(error2);
					return;
				}
				request.session.passport = temp;
				request.session.save(error3 => {
					defer.makeNodeResolver()(error3, user);
				});
			});
		});
		return defer.promise;
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
		const query = request.body;
		const clean = _.pick(query, ["password", "confirm"]);
		Object.assign(request.user, clean);
		return this.save(request.user)
			.then(user => q.nbind(request.login, request)(user))
			.thenResolve({success: true});
	}

	editEmail(request) {
		const clean = _.pick(request.body, ["email"]);
		Object.assign(request.user, clean);
		return this.save(request.user)
			.then(() => {
				return this.sendEmailVerification(request);
			});
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

	logout(request, response) {
		request.logout();
		request.session.destroy();
		response.clearCookie();
		return q({success: true});
	}
}
