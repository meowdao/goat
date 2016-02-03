"use strict";

import q from "q";
import AbstractUserController from "./abstract/user.js";
import {setRegExp} from "../utils/utils"

export default class UserController extends AbstractUserController {

	sync(request) {
		return q(request.user);
	}

	getUsers(request) {
		const query = request.query;
		const clean = {};
		const limit = 2;
		let skip = request.query.activePage * limit - limit;
		setRegExp(clean, query, ["email"]);
		return q.all([this.find(clean,{skip,limit}), this.count(clean)]).spread((list,count) => ({
			list,count
		}));

	}

}
