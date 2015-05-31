"use strict";

import messager from "../utils/messager.js";
import helper from "../utils/helper.js";


export default function (app) {

	app.use(function (request, response, next) {
		next(messager.makeError("page-not-found", true));
	});

	app.use(helper.sendError);

}
