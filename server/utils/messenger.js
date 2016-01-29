"use strict";

import {translate} from "./lang.js";
import {date} from "./constants/date.js";


function _makeError(text, code = 500) {
	const error = new Error();
	error.message = text;
	error.status = code;
	return error;
}

function getText(displayName, key, user, fallback) {
	return translate(`error/server/${displayName}-${key}`, user) || `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} ${fallback}`;
}

export function makeError(key, user, code = 400) {
	return _makeError(translate("error/server/" + key, user), code);
}

export function checkModel(user) {
	return function checkModelInner(model) {
		if (!model) {
			throw _makeError(getText(this.displayName, "not-found", user, "Not Found"), 404);
		} else {
			return model;
		}
	};
}

export function checkUser(user) {
	return function checkUserInner(model) {
		if (user._id.toString() !== model.user._id.toString()) {
			throw makeError("access-denied", user, 403);
		} else {
			return model;
		}
	};
}

export function checkActive(isAllowed = false) {
	return function checkActiveInner(model, request) {
		const isAdmin = !request.user.apiKeys[0].public;
		const isActive = model.status === this.constructor.statuses.active;
		if (!isActive && !(isAllowed && isAdmin)) {
			throw _makeError(getText(this.displayName, "not-active", request.user, "Is Not Active"), 400);
		} else {
			return model;
		}
	};
}

export function checkPast(isAllowed = false, field = "startTime") {
	return function checkPastInner(model, request) {
		const isAdmin = !request.user.apiKeys[0].public;
		const isPast = model[field] <= date; // <= for tests
		if (isPast && !(isAllowed && isAdmin)) {
			throw makeError("event-has-passed", request.user);
		}
	};
}
