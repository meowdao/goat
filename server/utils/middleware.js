"use strict";

import _ from "lodash";
import {makeError} from "../utils/messenger";

export function requiresLogin(request, response, next) {
	if (!request.user) { // isAuthenticated()
		return next(makeError("login", null, 401));
	}
	return next();
}

export function requiresRole(required, self) {
	return (request, response, next) => {
		requiresLogin(request, response, () => {
			if (!_.includes(required, request.user.role)) {
				return next(makeError("access-denied", request.user, 403));
			}
			return next();
		});
	};
}

export function methodNotAllowed(request, response, next) {
	return next(makeError("method-not-allowed", request.user, 405));
}

export function validatePagination(request, response, next) {
	if (!("skip" in request.query)) {
		request.query.skip = 0;
	} else {
		const skip = Math.floor(request.query.skip);
		if (skip.toString() !== request.query.skip || skip < 0) {
			next(makeError("invalid-param", request.user));
		}
	}
	if (!("limit" in request.query)) {
		request.query.limit = 50;
	} else {
		const limit = Math.floor(request.query.limit);
		if (limit.toString() !== request.query.limit || limit <= 0 || limit > 100) {
			next(makeError("invalid-param", request.user));
		}
	}
	next();
}