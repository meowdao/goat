"use strict";

import helper from "../utils/helper.js";
import middleware from "../utils/middleware.js";
import CategoryController from "../controllers/category.js";


export default function(app) {

	const categoryController = new CategoryController();

	app.route("/categories")
		.get(helper.simpleJSONWrapper(::categoryController.list))
		.post(middleware.requiresRole("admin"), helper.simpleJSONWrapper(::categoryController.insert))
		.all(middleware.methodNotAllowed);

	app.route("/categories/:_id")
		.get(helper.simpleJSONWrapper(::categoryController.getById))
		.put(middleware.requiresRole("admin"), helper.simpleJSONWrapper(::categoryController.edit))
		.delete(middleware.requiresRole("admin"), helper.simpleJSONWrapper(::categoryController.delete))
		.all(middleware.methodNotAllowed);

}
