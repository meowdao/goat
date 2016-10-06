import {pick, intersection} from "lodash";
import {getNewId} from "../../utils/mongoose";

import AbstractController from "../abstract/abstract";


export default class ApiKeyController extends AbstractController {

	static realm = "user";

	static param = "publicKey";

	static permissions = {
		blog: [
			"organization:update",

			"users:create",
			"users:read",
			"users:update",
			"users:delete"
		]
	};

	edit(request, object) {
		request.body.apiKey = request.body.apiKey || {};
		const clean = Object.assign({}, pick(request.body.apiKey, ["label", "netMasksV4", "netMasksV6", "public"]));
		clean.permissions = {};
		clean.permissions.operator = intersection(request.user.apiKey.permissions, request.body.apiKey.permissions || ApiKeyController.permissions[request.params.role]);
		return this.upsert({_id: object.apiKey || request.body.apiKey._id || getNewId()}, clean, {lean: false});
	}

	getById(request) {
		return this.getByUId(request);
	}

	insert(request) {
		const permissions = (request.body.apiKey || {}).permissions || {};
		return super.insert({user: request.user, body: request.body.apiKey}, [], {
			permissions: {
				...["blog"].reduce((memo, key) => Object.assign(memo, {[key]: intersection(request.user.apiKey.permissions[key], permissions[key])}), {})
			}
		});
	}

}
