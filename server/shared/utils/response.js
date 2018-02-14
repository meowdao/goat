import {omit} from "lodash";

export function paginate(request, response, controller, clean, options) {
	const {skip, limit} = request.query;
	return controller.count(clean)
		.then(count => {
			if (count) {
				return controller.find(clean, {limit, skip, sort: {_id: 1}, ...options})
					.then(list => ({list, count}));
			} else {
				return {
					list: [],
					count
				};
			}
		});
}

export function clearJSON(obj) {
	return omit("toJSON" in obj ? obj.toJSON() : obj, ["__v", "createdAt", "updatedAt", "id", "organizations"]);
}
