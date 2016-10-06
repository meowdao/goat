import {translate} from "./lang";
import {tpl} from "./misc";


function _makeError(text, code = 500) {
	const error = new Error();
	error.message = text;
	error.status = code;
	return error;
}

export function makeError(key, user, code = 400, data = {}) {
	return _makeError(tpl(translate(key, user), data), code);
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

export function checkRealm(isAllowed = false) {
	return function checkRealmInner(model, request) {
		if (request.user[this.constructor.realm]._id.toString() === model[this.constructor.realm]._id.toString() === isAllowed) {
			throw makeError("server.access-denied", request.user, 403);
		} else {
			return model;
		}
	};
}

export function checkActive(isAllowed = false, statuses = "active") {
	return function checkActiveInner(model, request) {
		const isAdmin = request.user.role === "admin";
		const isActive = statuses.includes(model.status);
		if (!isActive && !(isAllowed && isAdmin)) {
			throw makeError(`not-active.${this.constructor.displayName.toLowerCase()}`, request.user, 400);
		} else {
			return model;
		}
	};
}
