import bluebird from "bluebird";
import {pick} from "lodash";
import {checkModel, checkPermissions} from "../../shared/controllers/middleware";
import {makeError} from "../../shared/utils/error";
import {paginate} from "../../shared/utils/response";
import StatefulController from "../../shared/controllers/stateful";
import MailController from "../../mail/controllers/mail";
import TokenController from "../../mail/controllers/token";
import OrganizationController from "./organization";
import {getConnections} from "../../shared/utils/mongoose";


function myCheckOrganization() {
	return function myCheckOrganizationInner(model, request) {
		if (!model.organizations.map(organization => organization.toString()).includes(request.user.organization._id.toString())) {
			throw makeError("access-denied", 403, {reason: "organization"});
		}
	};
}

function myCheckPermissions(permission) {
	return function myCheckPermissionsInner(model, request) {
		if (request.user._id.toString() !== model._id.toString()) {
			checkPermissions(permission)(model, request);
		}
	};
}

export default class UserController extends StatefulController {
	static realm = "oauth2";

	typeahead(request) {
		return this.find({organizations: request.user.organization._id}) // don't remove _id
			.then(users => ({typeahead: users.map(user => pick(user, "fullName"))}));
	}

	deactivate(request) {
		return super.deactivate(request, {}, [myCheckPermissions("users:delete", request.params.realm)]);
	}

	edit(request) {
		return this.change(request, {}, [myCheckPermissions("users:update")], ["country", "fullName", "phoneNumber", "image", "language", "license"])
			.then(() => this.getByQuery({_id: request.params._id}));
	}

	getByUId(request, options = {}, conditions = []) {
		return this.findOne({
			[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param]
		}, options)
			.then(this.conditions(request, [checkModel(), myCheckOrganization()].concat(conditions)));
	}

	getByQuery(query, {populate = [], ...options} = {}) {
		const connections = getConnections();
		Object.assign(options, {
			populate: [{
				path: "organizations",
				model: connections.oauth2.model("Organization"),
			}].concat(populate)
		});
		return this.findOne(query, options);
	}

	list(request, response) {
		const clean = {
			organizations: request.user.organization
		};
		return paginate(request, response, this, clean);
	}

	insert(request) {
		const clean = pick(request.body, ["country", "confirm", "email", "fullName", "image", "language", "password", "social"]);
		Object.assign(clean, {
			isEmailVerified: request.params.isEmailVerified
		});
		return this.create(clean)
			.then(user => {
				const organizationController = new OrganizationController();
				return organizationController.create({
					email: user.email,
					companyName: user.fullName
				})
					.then(organization =>
						this.save(Object.assign(user, {organization}))
					);
			})
			.tap(user => {
				Object.assign(request, {user}); // don't login
				if (request.params.isEmailVerified) {
					return this.sendWelcomeEmail(request);
				} else {
					return this.sendVerificationEmail(request);
				}
			});
	}

	sendWelcomeEmail(request) {
		const mailController = new MailController();
		return mailController.compose("welcome", {
			to: request.user.email
		}, request.user.toObject());
	}

	sync(request) {
		return bluebird.resolve(request.isAuthenticated() ? request.user : null);
	}

	changePassword(request, response) {
		const tokenController = new TokenController();
		return tokenController.findOne({
			token: request.body.token,
			type: TokenController.types.password
		})
			.tap(model => checkModel().bind(tokenController)(model, request))
			.then(hash =>
				this.findById(hash.user, {lean: false})
					.then(user => {
						Object.assign(request, {user});
						return this.editPassword(request, response)
					})
					.then(() =>
						this.remove(hash)
					)
			)
			.thenReturn({success: true});
	}

	sendVerificationEmail(request) {
		const tokenController = new TokenController();
		return tokenController.upsert({
			user: request.user._id,
			type: TokenController.types.email
		}, {}, {}, {lean: true})
			.then(hash => {
				const mailController = new MailController();
				return mailController.compose("verification", {
					to: request.user.email
				}, request.user.toObject(), {
					hash
				});
			})
			.thenReturn({success: true});
	}

	verifyEmail(request) {
		const tokenController = new TokenController();
		return tokenController.findOneAndRemove({
			token: request.query.token,
			type: TokenController.types.email
		})
			.tap(model => checkModel().bind(tokenController)(model, request))
			.then(hash =>
				this.findByIdAndUpdate(hash.user, {isEmailVerified: true})
			)
			.thenReturn({success: true});
	}

	static logout(request, response) {
		request.session.destroy();
		request.logout();
		response.clearCookie();
		return bluebird.resolve({success: true});
	}

	editEmail(request, response) {
		const clean = pick(request.body, ["email"]);
		Object.assign(request.user, clean);
		return this.save(request.user)
			.tap(() =>
				this.sendVerificationEmail(request)
			)
			.tap(() =>
				UserController.logout(request, response)
			)
			.thenReturn({success: true});
	}

	editPassword(request, response) {
		const clean = pick(request.body, ["password", "confirm"]);
		Object.assign(request.user, clean);
		return this.save(request.user)
			.tap(() =>
				UserController.logout(request, response)
			)
			.thenReturn({success: true});
	}

	forgot(request) {
		return this.getByQuery({email: request.body.email})
			.then(user => {
				if (user) {
					const tokenController = new TokenController();
					return tokenController.upsert({
						user,
						type: TokenController.types.password
					}, {}, {}, {lean: true})
						.then(hash => {
							const mailController = new MailController();
							return mailController.compose("forgot", {to: user.email}, user, {
								hash
							});
						});
				}
			})
			.thenReturn({success: true});
	}

	resendToken(request) {
		return this.getByQuery({email: request.body.email}, {lean: false})
			.then(user => {
				if (!user)  {
					return {success: true} // just lie
				}

				Object.assign(request, {user}); // don't login
				return this.sendVerificationEmail(request)
			})

	}
}
