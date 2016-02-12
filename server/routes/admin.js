"use strict";

import {wrapJSON} from "../utils/helper";
import {methodNotAllowed, requiresRole, validatePagination} from "../utils/middleware";
import UserController from "../controllers/user";

export default function (app) {
	const userController = new UserController();

	app.route("/users")
		.get(requiresRole(["admin"]), validatePagination(), wrapJSON(::userController.list))
		.all(methodNotAllowed);

	app.put("/user/:_id", wrapJSON(::userController.change));

	// app.route("/user/:_id")
	//	.put(requiresRole(["admin"]), wrapJSON(::userController.change))
	//	.all(methodNotAllowed);
}
