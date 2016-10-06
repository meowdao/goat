import escapeStringRegexp from "escape-string-regexp";
import {isType} from "./misc";
import {makeError} from "./messenger";
import moment from "moment-config-trejgun";


export function setStatus(request, clean, constructor, active) {
	const query = request.query;
	const statuses = isType(query.status, "Object") ? query.status[constructor.name.slice(0, -10).toLowerCase()] : query.status;
	if (statuses) {
		if (isType(statuses, "Array") && statuses.length) {
			Object.assign(clean, {
				status: {
					$in: statuses.map(status => {
						if (!(status in constructor.statuses)) {
							throw makeError("server.param-is-invalid", request.user, 400, {name: "status"});
						}
						return constructor.statuses[status];
					})
				}
			});
		} else if (isType(statuses, "String") && statuses !== "all") {
			if (!(statuses in constructor.statuses)) {
				throw makeError("server.param-is-invalid", request.user, 400, {name: "status"});
			}
			Object.assign(clean, {
				status: statuses
			});
		}
	} else {
		Object.assign(clean, {
			status: active || constructor.statuses.active
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

export function paramToArray(param, type = String) {
	return [].concat(param).filter(item => item && isType(item, type.name));
}

export function parseDateRange(query, startTime = null, endTime = null) {
	return {
		startTime: query.dateRange && query.dateRange[0] ? moment.tz(query.dateRange[0], moment.ISO_8601, "UTC").toDate() : startTime,
		endTime: query.dateRange && query.dateRange[1] ? moment.tz(query.dateRange[1], moment.ISO_8601, "UTC").toDate() : endTime
	};
}
