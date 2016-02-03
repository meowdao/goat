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
		const a = this.find(clean, {"skip": skip, "limit": limit});
		const b = this.count(clean);
		return q.spread([a, b], (a, b) => {
			let result;
			result = a;
			result.push(b);
			return result;
		});

	}

}
