"use strict";

import _ from "lodash";
import messenger from "../utils/messenger.js";
import AbstractController from "./abstractController.js";

export default class StatefulController extends AbstractController {

	static param = "_id";

	static fields = [];

	static statuses = {
		active: "active",
		inactive: "inactive"
	};

	getById(request) {
		return this.check(request);
	}

	edit(request, fields = []) {
		return this.check(request)
			.then(item => {
				let clean = Object.assign(item, fields.length ? _.pick(request.body, fields) : request.body);
				return this.save(clean);
			});
	}

	check(request, conditions = []) {
		return this.findOne({[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param]}, {
			lean: false,
			populate: ["user"].concat(this.constructor.fields).join(" ")
		})
			.then(messenger.checkUser(request.user))
			.then(item => {
				conditions.forEach(condition => condition.bind(this)(item, request));
				return item;
			});
	}

	deactivate(request, conditions = []) {
		conditions.unshift(function (item, request) { // don't use =>
			if (item.status === this.constructor.statuses.inactive) {
				throw messenger.makeError("is-not-active", request.user);
			}
		});
		return this.check(request, conditions)
			.then(item => {
				item.status = this.constructor.statuses.inactive;
				return this.save(item);
			});
	}

	delete(request) {
		return this.deactivate(request)
			.thenResolve({success: true});
	}

}
