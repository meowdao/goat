import q from "q";
import {pick} from "lodash";
import passport from "passport";
import {reEmail} from "../../utils/constants/regexp";

import {makeError, checkModel} from "../../utils/messenger";
import StatefulController from "./stateful";
import MailController from "../mail/mail";
import HashController from "../mail/hash";

function myCheckOrganization(isAllowed = false) {
	return function myCheckOrganizationInner(model, request) {
		if (model.apiKeys.map(apiKey => apiKey.organization.toString()).includes(request.user.apiKey.organization._id.toString()) === isAllowed) {
			throw makeError("server.access-denied", request.user, 403);
		} else {
			return model;
		}
	};
}

function myCheckPermissions(permission, realm) {
	return function myCheckPermissionsInner(model, request) {
		if (request.user._id.toString() === model._id.toString()) {
			return model;
		} else {
			return checkPermissions(permission, realm)(model, request);
		}
	};
}

export default class AbstractUserController extends StatefulController {

	changePassword(request, response) {
		const hashController = new HashController();
		return hashController.findOneAndRemove({
			token: request.body.token,
			type: HashController.types.password
		})
			.then(model => checkModel().bind(hashController)(model, request))
			.then(hash =>
				this.findById(hash.user, {lean: false})
					.then(user => {
						Object.assign(request, {user});
						return this.editPassword(request, response);
					})
			);
	}

	checkEmail(request) {
		return this.count(request.params)
			.then(count => ({
				unique: !count,
				valid: reEmail.test(request.params.email)
			}));
	}

	editEmail(request) {
		request.params.sendVerificationEmail = true;
		const clean = pick(request.body, ["email"]);
		Object.assign(request.user, clean);
		return this.save(request.user)
			.then(() =>
				this.sendVerificationEmail(request)
			);
	}

	editPassword(request, response) {
		const clean = pick(request.body, ["password", "confirm"]);
		Object.assign(request.user, clean);
		return this.save(request.user)
			.then(user => q.nbind(request.login, request)(user))
			.then(() => {
				response.redirect("/#/");
			});
	}

	forgot(request) {
		return this.findOne({email: request.body.email})
			.then(user => {
				if (user) {
					const hashController = new HashController();
					return hashController.upsert({
						user,
						type: HashController.types.password
					})
						.then(hash => {
							const mailController = new MailController();
							return mailController.compose("user/forgot", {to: user.email}, user, {
								hash
							});
						});
				}
			})
			.thenResolve({success: true});
	}

	login(request, response) {
		const defer = q.defer();
		passport.authenticate("local", {badRequestMessage: "missing-credentials"}, (error, user, info) => {
			defer.makeNodeResolver()(error || info && makeError(info.message, request.user, 401), user);
		})(request, response);

		return defer.promise
			.then(user =>
				this.sessionChange(request, user)
			)
			.catch(error => {
				this.logout(request, response).done();
				throw error;
			});
	}

	logout(request, response) {
		request.logout();
		response.clearCookie();
		return q({success: true});
	}

	register(request) {
		return this.create(request.body)
			.tap(user => q.nbind(request.login, request)(user))
			.tap(() => this.sendVerificationEmail(request));
	}

	sendVerificationEmail(request) {
		const hashController = new HashController();
		return hashController.upsert({
			user: request.user._id,
			type: HashController.types.email
		})
			.then(hash => {
				const mailController = new MailController();
				return mailController.compose("user/verification", {
					to: request.user.email,
					status: request.params.sendVerificationEmail ? MailController.statuses.new : MailController.statuses.cancelled
				}, request.user, {
					hash
				});
			})
			.thenResolve({success: true});
	}

	sessionChange(request, user) {
		const defer = q.defer();
		request.login(user, error1 => {
			if (error1) {
				defer.makeNodeResolver()(error1);
				return;
			}
			const passport = request.session.passport;
			request.session.regenerate(error2 => {
				if (error2) {
					defer.makeNodeResolver()(error2);
					return;
				}
				Object.assign(request.session, {passport});
				request.session.save(error3 => {
					defer.makeNodeResolver()(error3, user);
				});
			});
		});
		return defer.promise;
	}

	verify(request) {
		const hashController = new HashController();
		return hashController.findOneAndRemove({
			token: request.params.token,
			type: HashController.types.email
		})
			.then(model => checkModel().bind(hashController)(model, request))
			.then(hash =>
				this.findByIdAndUpdate(hash.user, {isEmailVerified: true})
			)
			.thenResolve({success: true});
	}
}
