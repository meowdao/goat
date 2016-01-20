"use strict";

import {simpleJSONWrapper} from "../utils/helper.js";
import {requiresRole, methodNotAllowed} from "../utils/middleware.js";
import CategoryController from "../controllers/category.js";


export default function (app) {
	const categoryController = new CategoryController();

	app.route("/categories")
		.get(simpleJSONWrapper(::categoryController.list))
		.post(requiresRole("admin"), simpleJSONWrapper(::categoryController.insert))
		.all(methodNotAllowed);

	app.route("/categories/:_id")
		.get(simpleJSONWrapper(::categoryController.getById))
		.put(requiresRole("admin"), simpleJSONWrapper(::categoryController.edit))
		.delete(requiresRole("admin"), simpleJSONWrapper(::categoryController.delete))
		.all(methodNotAllowed);
}
