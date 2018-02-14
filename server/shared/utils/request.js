import escapeStringRegexp from "escape-string-regexp";
import {isType} from "./misc";
import {makeError} from "./error";


export function paramToArray(request, source, name, type = String) {
	const params = request[source][name];
	if (params === void 0) {
		return [];
	}
	const result = [].concat(params);
	result.forEach(param => {
		if (!isType(param, type.name)) {
			throw makeError("invalid-param", 400, {name});
		}
	});
	return result;
}

export function setStatus(request, clean, constructor) {
	const name = "status";
	const statuses = paramToArray(request, "query", name);
	if (statuses.length > 1) {
		statuses.forEach(status => {
			if (!(status in constructor.statuses)) {
				throw makeError("invalid-param", 400, {name});
			}
		});
		Object.assign(clean, {
			status: {
				$in: statuses
			}
		});
	} else if (statuses.length === 1) {
		if (!(statuses[0] in constructor.statuses)) {
			throw makeError("invalid-param", 400, {name});
		}
		Object.assign(clean, {
			status: statuses[0]
		});
	}
}

export function setRegExp(request, clean, fields) {
	const query = request.query;
	fields.forEach(name => {
		if (query[name]) {
			Object.assign(clean, {
				[name]: {
					$regex: escapeStringRegexp(!isType(query[name], "String") ? query[name].toString() : query[name]),
					$options: "i"
				}
			});
		}
	});
}
