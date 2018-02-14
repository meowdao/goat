import {isType} from "./misc";
import {makeError} from "./error";


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


export function validateParams(rulesSet, source, code = 400) {
	return (request, response, next) => {
		try {
			rulesSet.forEach(rules => {
				if (!(rules.name in request[source])) {
					if ("default" in rules) {
						Object.assign(request[source], {[rules.name]: rules.default});
					} else if (rules.required === true) {
						throw makeError("invalid-param", code, {name: rules.name, reason: "required"});
					}
				} else if (!Object.keys(rules).every(key => validator[key](request[source][rules.name], rules[key]))) {
					throw makeError("invalid-param", code, {name: rules.name, reason: "invalid"});
				}
			});
			return next();
		} catch (e) {
			return next(e);
		}
	};
}

export function methodNotAllowed(request, response, next) {
	return next(makeError("method-not-allowed", 405));
}

export function requiresLogin(request, response, next) {
	if (request.isUnauthenticated()) {
		return next(makeError("login", 401));
	}
	return next();
}

export function checkPermissions(prefix, object, action) {
	return (request, response, next) => {
		if (object && !request.user.permissions.includes(`${object}:${action}`)) {
			return next(makeError("access-denied", 403));
		}
		return next();
	};
}
