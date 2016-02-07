"use strict";

import {wrapJSON} from "../utils/helper.js";
import {methodNotAllowed, requiresRole, validatePagination} from "../utils/middleware.js";
import UserController from "../controllers/user.js";

export default function (app) {
	const userController = new UserController();

	app.route("/admin/users")
		.get(requiresRole("admin"), validatePagination, wrapJSON(::userController.list))
		.all(methodNotAllowed);

	app.route("/admin/user/:_id")
		.put(requiresRole("admin"), wrapJSON(::userController.change))
		.all(methodNotAllowed);
}
