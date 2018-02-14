import {times} from "lodash";
import {isType} from "../server/shared/utils/misc";

export default function populate(requires, parents, children, makeDefaults) {
	return times(parents.length, i => {
		const result = {};
		Object.keys(requires || {}).forEach(model => {
			if (isType(requires[model], "String")) {
				if (requires[model] === "o2o") {
					result[model] = children[model][i];
				} else if (requires[model] === "m2o") {
					result[model] = children[model][0];
				} else if (requires[model] === "o2m" || requires[model] === "m2m") {
					result[model] = children[model];
				} else {
					result[model] = [];
				}
			} else if (isType(requires[model], "Array")) {
				if (isType(requires[model][i], "Array")) {
					result[model] = children[model].filter((item, j) => requires[model][i].indexOf(j) !== -1);
				} else if (isType(requires[model][i], "Number")) {
					result[model] = children[model][requires[model][i]];
				} else {
					result[model] = null;
				}
			} else if (isType(requires[model], "Function")) {
				result[model] = children[model].filter(requires[model](model, i));
			} else {
				result[model] = [];
			}
		});

		return makeDefaults(parents[i], result, i);
	});
}
