"use strict";

import q from "q";

import AbstractUserController from "./abstract/user.js";

export default class UserController extends AbstractUserController {

	sync(request) {
		return q(request.user);
	}

}
