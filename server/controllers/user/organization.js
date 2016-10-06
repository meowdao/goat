import {makeError} from "../../utils/error";
import {checkModel} from "../../utils/middleware";
import {getConnections} from "../../utils/mongoose";
import {merge} from "lodash";
import {paginate} from "../../utils/response";
import {goatId} from "../../utils/constants/misc";

import StatefulController from "../abstract/stateful";
import LocationController from "./location";
import ApiKeyController from "../user/api-key";
import UserController from "../user/user";


export function myCheckOrganization(isAllowed = false) {
	return function myCheckOrganizationInner(model, request) {
		if (request.user.apiKey.organization._id.toString() === model._id.toString() === isAllowed) {
			throw makeError("server.access-denied", request.user, 403);
		} else {
			return model;
		}
	};
}

export default class OrganizationController extends StatefulController {

	static realm = "user";

	edit(request) {
		return this.change(request, {
			populate: [{
				path: "location",
				model: getConnections().user.model("Location")
			}]
		}, [myCheckOrganization()], ["companyImage", "companyName", "domainName", "email", "phoneNumber"])
			.tap(organization => {
				const locationController = new LocationController();
				return locationController.edit(request, organization)
					.tap(location =>
						this.save(Object.assign(organization, {location}))
					);
			});
	}

	getByUId(request, options = {}, conditions = []) {
		return this.findOne({
			[this.constructor.param]: request.params[this.constructor.param]// || request.body[this.constructor.param]
		}, options)
			.then(this.conditions(request, [checkModel()].concat(conditions)));
	}

	getUsers(request, response) {
		const apiKeyController = new ApiKeyController();
		return apiKeyController.distinct("user", {organizations: request.user.apiKey.organization})
			.then(users => {
				const userController = new UserController();
				return paginate(request, response, userController, {_id: {$in: users}}, {sort: {fullName: 1}});
			});
	}

	insert(request) {
		Object.assign(request.params, Object.assign({
			activeOnRegister: true,
			sendVerificationEmail: true
		}, request.params));
		const userController = new UserController();
		const locationController = new LocationController();
		const apiKeyController = new ApiKeyController();
		return locationController.insert(request)
			.then(location =>
				super.insert(request, ["companyImage", "companyName", "domainName", "email", "phoneNumber", "social", "reminders"], {location, calendarId: request.params.role === "operator" ? null : calendarId})
					.tap(organization =>
						userController.insert({
							user: {
								apiKey: {
									permissions: request.user.apiKey.permissions,
									organization
								}
							},
							body: request.body,
							params: request.params
						})
							.tap(user =>
								apiKeyController.insert(request)
									.then(apiKey =>
										apiKeyController.save(Object.assign(apiKey, {user, organizations: [organization]}))
									)
							)
							.catch(this._onInsertFail(organization))
					)
					.catch(e =>
						locationController.remove(location)
							.thenReject(e)
					)
			);
	}

	_onInsertFail(company) {
		return e => this.remove(company)
			.thenReject(e);
	}

	_fixPermissions(request, module, role) {
		merge(request, {
			body: {
				apiKey: {
					permissions: {
						[module]: ApiKeyController.permissions[role]
					}
				}
			}
		});
	}

	_fixUser(request, module, role) {
		merge(request, {
			user: {
				apiKey: {
					permissions: {
						[module]: ApiKeyController.permissions[role]
					},
					organization: {
						_id: goatId
					}
				}
			}
		});
	}
}
