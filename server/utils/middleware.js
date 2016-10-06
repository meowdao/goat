import {makeError} from "./error";
import {intersection} from "lodash";
import {date} from "../utils/constants/date";


export function checkActive(isAllowed = false, statuses = ["active"]) {
	return function checkActiveInner(model, request) {
		const isAdmin = !request.user.apiKey.public;
		const isActive = statuses.includes(model.status);
		if (!isActive && !(isAllowed && isAdmin)) {
			throw makeError(`not-active.${this.constructor.displayName.toLowerCase()}`, request.user, 400);
		} else {
			return model;
		}
	};
}

export function checkModel() {
	return function checkModelInner(model, request) {
		if (!model) {
			throw makeError(`not-found.${this.constructor.displayName.toLowerCase()}`, request.user, 404);
		} else {
			return model;
		}
	};
}

export function checkOwner(isAllowed = false) {
	return function checkOwnerInner(model, request) {
		const u = request.user.apiKeys.map(apiKey => apiKey.organizations[0]._id.toString());
		if (u.includes(model.owner.toString()) === isAllowed) {
			throw makeError("server.access-denied", request.user, 403);
		} else {
			return model;
		}
	};
}

export function checkPast(isAllowed = false, field = "startTime") {
	return function checkPastInner(model, request) {
		const isAdmin = !request.user.apiKey.public;
		const isPast = model[field] <= date; // <= for tests
		if (isPast && !(isAllowed && isAdmin)) {
			throw makeError("controller.event-has-passed", request.user);
		} else {
			return model;
		}
	};
}

export function checkPublic() {
	return function checkPublicInner(model, request) {
		if (!model.public) {
			throw makeError("server.access-denied", request.user, 403);
		} else {
			return model;
		}
	};
}

export function checkPublicContract(publicContract) {
	return function checkPublicContractInner(model, request) {
		const isPublic = request.params._id.toString() === publicContract._id.toString();
		if (isPublic && !request.body.public) {
			throw makeError("controller.contract-must-have-public-contract", 400);
		} else {
			return model;
		}
	};
}

export function checkOrganization(isAllowed = false) {
	return function checkOrganizationInner(model, request) {
		const m = model.organizations.map(organization => organization._id.toString());
		const u = request.user.apiKeys.map(apiKey => apiKey.organizations[0]._id.toString());
		if (intersection(m, u).length > 0 === isAllowed) {
			throw makeError("server.access-denied", request.user, 403);
		} else {
			return model;
		}
	};
}

export function checkPermissions(permission, realm) {
	return function checkPermissionsInner(model, request) {
		if (!request.user.apiKey.permissions[realm || this.constructor.realm].includes(permission)) {
			throw makeError("server.access-denied", request.user, 403);
		} else {
			return model;
		}
	};
}

