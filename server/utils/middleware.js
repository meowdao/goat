"use strict";

import _ from "lodash";
import {makeError} from "../utils/messenger.js";

export function requiresLogin(request, response, next) {
	if (!request.user) { // isAuthenticated()
		return next(makeError("login", null, 401));
	}
	return next();
}

export function requiresRole(required, self) {
	return (request, response, next) => {
		requiresLogin(request, response, () => {
			if (!_.includes(required, request.user.role) || !(self && request.user._id.toString() === request.params.id)) {
				return next(makeError("access-denied", request.user, 403));
			}
			return next();
		});
	};
}

export function methodNotAllowed(request, response, next) {
	return next(makeError("method-not-allowed", request.user, 405));
}
