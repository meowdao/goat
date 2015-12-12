"use strict";

import Q from "q";

import AbstractUserController from "./user-abstract.js";

export default class UserController extends AbstractUserController {

	sync(request) {
		return Q(request.user);
	}

}

