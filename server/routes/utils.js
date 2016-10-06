import {isType} from "../utils/misc";
import {makeError} from "../utils/error";

const validator = {
	type(val, type) {
		return isType(val, type.name);
	},
	call(val, fn) {
		return fn(val);
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
		return options.includes(val);
	},
	required(val, flag) {
		return !flag || val !== void 0;
	},
	regexp(val, regexp) {
		return regexp.test(val);
	},
	name() {
		return true; // always true
	},
	default() {
		return true; // always true
	}
};


export function validateParams(rulesSet, source) {
	return (request, response, next) => {
		try {
			rulesSet.forEach(rules => {
				if (!(rules.name in request[source])) {
					if ("default" in rules) {
						Object.assign(request[source], {[rules.name]: rules.default});
					} else if (rules.required === true) {
						throw makeError("server.param-is-required", request.user, 400, {name: rules.name});
					}
				} else if (!Object.keys(rules).every(key => validator[key](request[source][rules.name], rules[key]))) {
					throw makeError("server.param-is-invalid", request.user, 400, {name: rules.name});
				}
			});
			return next();
		} catch (e) {
			return next(e);
		}
	};
}

export function methodNotAllowed(request, response, next) {
	return next(makeError("server.method-not-allowed", request.user, 405));
}

export function requiresLogin(request, response, next) {
	if (request.isUnauthenticated()) {
		return next(makeError("server.login", null, 401));
	}
	return next();
}

export function checkPermissions(prefix, object, action) {
	return (request, response, next) => {
		if (object && !request.user.apiKey.permissions[prefix].includes(`${object}:${action}`)) {
			return next(makeError("server.access-denied", request.user, 403));
		}
		return next();
	};
}

export function checkFeatures(prefix, object) {
	return (request, response, next) => {
		if (object && !request.user[prefix].preferences.features[object]) {
			return next(makeError("server.feature-is-not-enabled", request.user, 401));
		}
		return next();
	};
}

export const params = {
	page: {
		name: "page",
		type: Number,
		default: 0
	},
	pageSize: {
		name: "pageSize",
		type: Number,
		default: 50,
		min: 0,
		max: 100
	},
	amount: {
		name: "amount",
		type: Number,
		min: 0,
		call: Number.isInteger
	}
};
