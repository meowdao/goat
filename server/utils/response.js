import qs from "qs";
import {getServerUrl} from "./misc";


export function addPaginationHeaders(request, response, count) {
	const last = Math.ceil(count / request.query.pageSize);
	const url = `${getServerUrl()}${request.route.path}?`;

	response.set("X-First-Page-Url", url + qs.stringify({
			pageSize: request.query.pageSize,
			page: 0
		}));

	if (request.query.page !== 0) {
		response.set("X-Prev-Page-Url", url + qs.stringify({
				pageSize: request.query.pageSize,
				page: request.query.page - 1
			}));
	}

	if (request.query.page !== last) {
		response.set("X-Next-Page-Url", url + qs.stringify({
				pageSize: request.query.pageSize,
				page: request.query.page + 1
			}));
	}

	response.set("X-Last-Page-Url", url + qs.stringify({
			pageSize: request.query.pageSize,
			page: last
		}));
}

export function paginate(request, response, controller, clean, options) {
	return controller.count(clean)
		.then(count => {
			addPaginationHeaders(request, response, count);
			if (count) {
				return controller.find(clean, Object.assign({}, options, {
					limit: request.query.pageSize,
					skip: request.query.page * request.query.pageSize
				}));
			}
			return [];
		});
}
