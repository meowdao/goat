"use strict";

import _ from "lodash";
import {checkModel, checkUser, checkActive} from "../../utils/messenger";
import AbstractController from "./abstract";

export default class StatefulController extends AbstractController {

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
				[this.constructor.realm]: request.user._id,
				status: this.constructor.statuses.active
			})
			.then(list => ({list}));
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
				} else {
					return item;
				}
			});
	}

	check(request, populate = [], conditions = []) {
		return this.findOne({[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param]}, {
				lean: false,
				populate: [this.constructor.realm].concat(populate)
			})
			.then(this.conditions(request, [checkModel(request.user), checkUser(request.user)].concat(conditions)));
	}

	deactivate(request, populate = [], conditions = []) {
		return this.check(request, populate)
			.then(this.conditions(request, [checkActive(false)].concat(conditions)))
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
