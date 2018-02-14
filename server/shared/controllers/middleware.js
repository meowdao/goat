import {intersection} from "lodash";
import {makeError} from "../utils/error";


export function checkActive(statuses = []) {
	return function checkActiveInner(model) {
		if (![].concat(statuses, this.constructor.statuses.active).includes(model.status)) {
			throw makeError("not-active", 410, {name: this.constructor.name.slice(0, -10).toLowerCase()});
		}
	};
}

export function checkModel() {
	return function checkModelInner(model) {
		if (!model) {
			throw makeError("not-found", 404, {name: this.constructor.name.slice(0, -10).toLowerCase()});
		}
	};
}

export function checkOrganization() {
	return function checkOrganizationInner(model, request) {
		const m = model.organizations.map(organization => organization._id.toString());
		const u = request.user.organizations.map(organization => organization._id.toString());
		if (!intersection(m, u).length) {
			throw makeError("access-denied", 403, {reason: "organization"});
		}
	};
}

export function checkPermissions(permission) {
	return function checkPermissionsInner(model, request) {
		if (!request.user.permissions.includes(permission)) {
			throw makeError("access-denied", 403, {reason: "permissions"});
		}
	};
}

