import bluebird from "bluebird";
import {omit, difference} from "lodash";
import {makeError} from "../../shared/utils/error";

import AbstractController from "../../shared/controllers/abstract";
import MailController from "./mail";


export default class OptOutController extends AbstractController {
	static realm = "mail";

	getByUser(request) {
		if (request.params._id !== request.user._id.toString()) {
			return bluebird.reject(makeError("access-denied", 403, {reason: "user"}));
		}
		return this.distinct("type", {user: request.params._id})
			.then(types =>
				Object.keys(MailController.types[process.env.MODULE])
					.reduce((memo, type) =>
						Object.assign(memo, {
							[type]: !types.includes(type)
						}), {
						_id: request.params._id
					})
			);
	}

	replace(request) {
		if (request.params._id !== request.user._id.toString()) {
			return bluebird.reject(makeError("access-denied", 403, {reason: "user"}));
		}
		const types = omit(request.body, "_id");
		const diff = difference(Object.keys(types), Object.keys(MailController.types[process.env.MODULE]));
		if (diff.length) {
			return bluebird.reject(makeError("invalid-param", 400, {name: diff[0], reason: "unrecognized"}));
		}
		return this.remove({user: request.params._id})
			.then(() =>
				this.create(Object.keys(types)
					.filter(type => !types[type])
					.map(type => ({
						type,
						user: request.params._id
					}))
				))
			.then(() => this.getByUser(request));
	}
}
