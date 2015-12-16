"use strict";

import Q from "q";

import AbstractUserController from "./abstract/user.js";

export default class UserController extends AbstractUserController {

	sync(request) {
		return Q(request.user);
	}

}

