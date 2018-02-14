import {difference} from "lodash";
import catalog from "../../../shared/data/vehicles.json";
import {makeError} from "../../shared/utils/error";

function checkParam(name, clean, rest) {
	if (clean[name] === void 0) {
		return rest;
	}

	if (!catalog.find(vehicle => vehicle[name] === clean[name])) {
		throw makeError("invalid-param", 400, {name, reason: "invalid"});
	}

	const filtered = rest.filter(vehicle => vehicle[name] === clean[name]);

	if (!filtered.length) {
		throw makeError("invalid-param", 400, {name, reason: "combination"});
	}

	return filtered;
}

export function checkInCatalog(clean, full = true) {
	let rest = catalog;

	const fields = ["type", "brand", "model", "fuel", "cc"];

	if (full) {
		const diff = difference(fields, Object.keys(clean));
		if (diff.length) {
			throw makeError("invalid-param", 400, {name: diff[0], reason: "required"});
		}
	}

	fields.forEach(name => {
		rest = checkParam(name, clean, rest);
	});
}
