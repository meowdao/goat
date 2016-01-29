"use strict";

import {wrapJSON} from "../utils/helper.js";
import {requiresRole, methodNotAllowed} from "../utils/middleware.js";
import CategoryController from "../controllers/category.js";


export default function (app) {
	const categoryController = new CategoryController();

	app.route("/categories")
		.get(wrapJSON(::categoryController.list))
		.post(requiresRole("admin"), wrapJSON(::categoryController.insert))
		.all(methodNotAllowed);

	app.route("/categories/:_id")
		.get(wrapJSON(::categoryController.getById))
		.put(requiresRole("admin"), wrapJSON(::categoryController.edit))
		.delete(requiresRole("admin"), wrapJSON(::categoryController.delete))
		.all(methodNotAllowed);
}
