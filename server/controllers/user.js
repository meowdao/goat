"use strict";

import q from "q";
import _ from "lodash";
import AbstractUserController from "./abstract/user.js";
import {setRegExp} from "../utils/utils";

export default class UserController extends AbstractUserController {

	sync(request) {
		return q(request.user);
	}

	list(request) {
		const query = request.query;
		const {skip, limit} = query;
		const clean = {};
		setRegExp(clean, query, ["email"]);
		return q.all([
				this.find(clean, {skip, limit}),
				this.count(clean)
			])
			.spread((list, count) => ({list, count}));
	}

	change(request) {
		const query = request.body;
		const clean = _.pick(query, ["isActive", "firstName", "lastName"]);
		return this.findByIdAndUpdate(request.params._id, clean, {runValidators: true, new: true});
	}

	edit(request) {
		const query = request.body;
		const clean = _.pick(query, ["firstName", "lastName"]);
		Object.assign(request.user, clean);
		return this.save(request.user);
	}

}
