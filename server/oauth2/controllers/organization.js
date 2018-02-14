import bluebird from "bluebird";
import {pick} from "lodash";
import {makeError} from "../../shared/utils/error";
import {checkModel} from "../../shared/controllers/middleware";
import {paginate} from "../../shared/utils/response";

import StatefulController from "../../shared/controllers/stateful";
import UserController from "./user";


export function myCheckOrganization(isAllowed = false) {
	return function myCheckOrganizationInner(model, request) {
		if (request.user.organization._id.toString() === model._id.toString() === isAllowed) {
			throw makeError("access-denied", 403, {reason: "organization"});
		}
	};
}

export default class OrganizationController extends StatefulController {
	static realm = "oauth2";

	static statuses = {
		active: "active",
		inactive: "inactive",
		suspended: "suspended"
	};

	static types = {
		person: "person",
		rental: "rental"
	};

	edit(request) {
		return this.change(request, {}, [], ["address", "checkOutTime", "companyName", "coordinates", "delivery", "domainName", "email", "phoneNumber"])
			.then(organization =>
				Object.assign(organization.toJSON(), {
					// restore properties
					location: void 0,
					coordinates: organization.location && organization.location.coordinates,
					address: organization.address
				})
			);
	}

	getByUId(request, options = {}, conditions = []) {
		return this.findOne({
			[this.constructor.param]: request.params[this.constructor.param]// || request.body[this.constructor.param]
		}, options)
			.then(this.conditions(request, [checkModel(), myCheckOrganization()].concat(conditions)));
	}

	getById(request) {
		return this.getByUId(request)
			.then(organization =>
				Object.assign(organization, {
					// restore properties
					location: void 0,
					coordinates: organization.location && organization.location.coordinates,
					address: organization.address
				})
			);
	}

	getUsers(request, response) {
		const userController = new UserController();
		return paginate(request, response, userController, {organizations: request.user.organizations[0]}, {sort: {fullName: 1}});
	}

	insert(request) {
		const clean = pick(request.body, ["address", "checkOutTime", "companyName", "coordinates", "delivery", "domainName", "email", "phoneNumber"]);
		return this.create(clean)
			.tap(organization => {
				request.user.organizations.push(organization);
				const userController = new UserController();
				return userController.save(request.user);
			})
			.then(organization =>
				Object.assign(organization.toJSON(), {
					// restore properties
					location: void 0,
					coordinates: organization.location && organization.location.coordinates,
					address: organization.address
				})
			);
	}

}
