"use strict";

import _ from "lodash";
import messenger from "../utils/messenger.js";
import AbstractController from "./abstract-controller.js";

class StatefulController extends AbstractController {

	static param = "_id";

	static statuses = {
		active: "active",
		inactive: "inactive"
	};

	getById(request) {
		return this.check(request);
	}

	list(request) {
		return this.find({
				user: request.user._id,
				status: this.constructor.statuses.active
			})
			.then(items => {
				return {[this.displayName + "s"]: items};
			});
	}

	edit(request) {
		return this.change(request);
	}

	change(request, populate = [], fields = []) {
		return this.check(request, populate)
			.then(item => {
				if (item.status === this.constructor.statuses.inactive) {
					throw messenger.notActive(this.displayName, request.user);
				}
				return item;
			})
			.then(item => {
				let clean = Object.assign(item, fields.length ? _.pick(request.body, fields) : request.body);
				return this.save(clean);
			});
	}

	check(request, populate = [], conditions = []) {
		return this.findOne({[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param]}, {
				lean: false,
				populate: ["user"].concat(populate)
			})
			.then(messenger.checkUser(this.displayName, request.user))
			.then(item => {
				conditions.forEach(condition => condition.bind(this)(item, request));
				return item;
			});
	}

	deactivate(request, populate = [], conditions = []) {
		conditions.unshift(function (item, request) { // don't use =>
			if (item.status === this.constructor.statuses.inactive) {
				throw messenger.notActive(this.displayName, request.user);
			}
		});
		return this.check(request, populate, conditions)
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

export default StatefulController;
