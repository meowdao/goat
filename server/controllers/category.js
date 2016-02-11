"use strict";

import _ from "lodash";
import StatefulController from "./abstract/stateful";


export default class CategoryController extends StatefulController {

	static param = "categoryId";

	list() {
		return this.find()
			.then(items => ({items}));
	}

	insert(request) {
		const clean = _.pluck(request.body, ["title", "categoryId", "parent", "order"]);
		return this.create(clean);
	}

	getById(request) {
		return this.findOne({[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param]}, {
			lean: false,
			populate: ["parent"]
		});
	}

	delete(request) {
		return this
			.findByIdAndRemove(request.params._id, {
				lean: false,
				populate: ["parents"]
			})
			.then(() => {
				this.update({}, {$pull: {parants: request.params._id}});
			});
	}

}
