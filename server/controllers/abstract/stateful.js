"use strict";

import _ from "lodash";
import {isFound, isMine, isActive} from "../../utils/messenger.js";
import AbstractController from "./abstract.js";

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
		return this
			.find({
				user: request.user._id,
				status: this.constructor.statuses.active
			})
			.then(items => ({items}));
	}

	edit(request) {
		return this.change(request);
	}

	change(request, populate = [], conditions = [], fields = []) {
		return this.check(request, populate, conditions)
			.then(item => {
				const clean = fields.length ? _.pick(request.body, fields) : request.body;
				if (Object.keys(clean).length) {
					Object.assign(item, clean);
					return this.save(item);
				}
				return item;
			});
	}

	check(request, populate = [], conditions = []) {
		return this
			.findOne({[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param]}, {
				lean: false,
				populate: ["user"].concat(populate)
			})
			.then(isFound(this, request.user))
			.then(isMine(this, request.user))
			.then(this.conditions(request, conditions));
	}

	deactivate(request, populate = [], conditions = []) {
		return this.check(request, populate)
			.then(this.conditions(request, [isActive(false)].concat(conditions)))
			.then(item => {
				item.set("status", this.constructor.statuses.inactive);
				return this.save(item);
			});
	}

	delete(request) {
		return this.deactivate(request)
			.thenResolve({success: true});
	}

	conditions(request, conditions = []) {
		return item => {
			conditions.forEach(condition => condition.bind(this)(item, request));
			return item;
		};
	}

}

export default StatefulController;
