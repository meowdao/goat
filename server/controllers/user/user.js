import q from "q";
import {pick} from "lodash";
import {checkModel, checkPublic, checkPermissions} from "../../utils/middleware";
import {makeError} from "../../utils/error";
import {goatId} from "../../utils/constants/misc";
import {getConnections} from "../../utils/mongoose";
import {paginate} from "../../utils/response";

import ApiKeyController from "../user/api-key";
import StatefulController from "../abstract/stateful";
import HashController from "../mail/hash";
import LocationController from "./location";
import MailController from "../mail/mail";

const reEmail = exports.reEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;


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

export default class UserController extends StatefulController {

	static realm = "user";

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

	deactivate(request) {
		return super.deactivate(request, {}, [myCheckPermissions("users:delete", request.params.realm)]);
	}

	edit(request) {
		request.params._id = request.params._id || request.user._id;
		return this.change(request, {
			populate: [{
				path: "location",
				model: getConnections().user.model("Location")
			}]
		}, [myCheckPermissions("users:update", request.params.realm)], ["isEmailVerified", "isPhoneNumberVerified", "fullName", "lang", "phoneNumber", "reminders", "status"])
			.then(user => {
				const apiKeyController = new ApiKeyController();
				const locationController = new LocationController();
				return q.all([
					apiKeyController.edit(request, user),
					locationController.edit(request, user)
				])
					.spread((apiKey, location) =>
						this.save(Object.assign(user, {location, apiKey}))
					);
			});
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
		return this.getByQuery({email: request.body.email})
			.then(user => {
				if (user) {
					const hashController = new HashController();
					return hashController.upsert({
						user,
						type: HashController.types.password
					})
						.then(hash => {
							const mailController = new MailController();
							return mailController.compose("forgot", {to: user.email}, user, {
								hash
							});
						});
				}
			})
			.thenResolve({success: true});
	}

	impersonate(request, response) {
		return this.getByQuery({_id: request.params._id})
			.then(user => {
				request.session.supervisor = request.user._id.toString();
				return q.denodeify(request.login)(user);
			})
			.then(() => {
				response.redirect("/#/");
			});
	}

	depersonalize(request, response) {
		return this.getByQuery({_id: request.session.supervisor})
			.then(user => {
				request.session.supervisor = null;
				return q.denodeify(request.login)(user);
			})
			.then(() => {
				response.redirect("/#/");
			});
	}

	getByUId(request, {populate = [], ...options} = {}, conditions = []) {
		Object.assign(options, {
			lean: false, populate: [{
				path: "apiKeys",
				model: getConnections().user.model("ApiKey")
			}].concat(populate)
		});
		return this.findOne({
			[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param]
		}, options)
			.then(this.conditions(request, [checkModel(), myCheckOrganization()].concat(conditions)));
	}

	getById(request) {
		return this.getByUId(request, {}, [myCheckPermissions("users:read", request.params.realm)]);
	}

	getByApiKey(request) {
		const apiKeyController = new ApiKeyController();
		return apiKeyController.findOne({publicKey: request.params.publicKey})
			.then(model => checkModel().bind(apiKeyController)(model, request))
			.then(model => checkPublic().bind(apiKeyController)(model, request))
			.then(apiKey => this.getByQuery({_id: apiKey.user}))
			.then(user => user.toJSON({virtuals: true}));
	}

	getByQuery(query) {
		const connections = getConnections();
		return this.findOne(query, {
			populate: [{
				path: "apiKeys",
				model: connections.user.model("ApiKey"),
				populate: [{
					path: "organizations",
					model: connections.user.model("Organization"),
					populate: [{
						path: "location",
						model: connections.user.model("Location")
					}]
				}]
			}, {
				path: "location",
				model: connections.user.model("Location")
			}],
			lean: false
		});
	}

	insert(request) {
		const locationController = new LocationController();
		return locationController.insert(request)
			.then(location =>
				super.insert(request, ["confirm", "email", "fullName", "lang", "password", "phoneNumber", "reminders"], {
					location,
					status: request.params.activeOnRegister ? UserController.statuses.active : UserController.statuses.inactive
				})
					.tap(user => this.sendVerificationEmail({user, params: request.params}))
					.catch(e =>
						locationController.remove(location)
							.thenReject(e)
					)
			);
	}

	list(request, response) {
		return paginate(request, response, this, {});
	}

	logout(request, response) {
		request.logout();
		response.clearCookie();
		return q({success: true});
	}

	me(request) {
		return q(request.isAuthenticated() ? request.user.toJSON({virtuals: true}) : {authenticated: false});
	}

	sendVerificationEmail(request) {
		const hashController = new HashController();
		return hashController.upsert({
			user: request.user._id,
			type: HashController.types.email
		})
			.then(hash => {
				const mailController = new MailController();
				return mailController.compose("verification", {
					to: request.user.email,
					status: request.params.sendVerificationEmail ? MailController.statuses.new : MailController.statuses.cancelled
				}, Object.assign({}, request.user.toObject(), {apiKey: {organization: {_id: goatId}}}), {
					hash
				});
			})
			.thenResolve({success: true});
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
