"use strict";

import q from "q";
import _ from "lodash";
import AbstractUserController from "./abstract/user.js";
import {setRegExp} from "../utils/utils";

export default class UserController extends AbstractUserController {

	sync(request) {
		return q(request.user);
	}

	getUsers(request) {
		const query = request.query;
		const clean = {};
		const skip = request.query.skip;
		const limit = request.query.limit;
		setRegExp(clean, query, ["email"]);
		return q.all([this.find(clean, {skip, limit}), this.count(clean)])
			.spread((list, count) => ({
				list, count
			}));
	}

	usersUpdate(request) {
		const query = request.body;
		const clean = _.pick(query, ["isActive", "isEmailVerified", "firstName", "lastName", "role"]);
		return this.findByIdAndUpdate(request.params, clean, {new: true})
				.tap((user) => {
					console.log("User updated: " + user);
					return user;
				});
		}
}
