"use strict";


import {isType} from "./utils";
import {makeError} from "../utils/messenger";

const validator = {
	type(val, type) {
		// because value is actually a string
		return type === Number ? Number(val).valueOf().toString() === val : isType(val, type.name);
	},
	min(val, min) {
		return val >= min;
	},
	max(val, max) {
		return val <= max;
	},
	minlength(val, min) {
		return val.length >= min;
	},
	maxlength(val, max) {
		return val.length <= max;
	},
	enum(val, options) {
		return !~options.indexOf(val);
	},
	required(val) {
		return !!val;
	},
	regexp(val, regexp) {
		return regexp.test(val);
	},
	default() {
		return true; // always true
	}
};

export function requiresLogin(request, response, next) {
	if (!request.isAuthenticated()) {
		return next(makeError("login", null, 401));
	}
	return next();
}

export function requiresRole(required) {
	return (request, response, next) => {
		requiresLogin(request, response, () => {
			if (!~required.indexOf(request.user.role)) {
				return next(makeError("access-denied", request.user, 403));
			}
			return next();
		});
	};
}

export function methodNotAllowed(request, response, next) {
	return next(makeError("method-not-allowed", request.user, 405));
}


export function validateParams(rules, source) {
	return (request, response, next) => {
		const errors = [];
		Object.keys(rules).forEach(name => {
			if (!(name in request[source])) {
				if ("default" in rules[name]) {
					Object.assign(request[source], {[name]: rules[name].default});
				} else if (rules[name].required === true) {
					errors.push(makeError("no-param", request.user));
				}
			} else if (!Object.keys(rules[name]).every(key => validator[key](request[source][name], rules[name][key]))) {
				errors.push(makeError("invalid-param", request.user));
			}
		});
		return next(errors[0]);
	};
}

export function validatePagination() {
	return validateParams({
		skip: {
			type: Number,
			default: 0
		},
		limit: {
			type: Number,
			default: 50,
			min: 0,
			max: 100
		}
	}, "query");
}
