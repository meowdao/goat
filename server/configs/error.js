"use strict";

import messenger from "../utils/messenger.js";
import helper from "../utils/helper.js";


export default function (app) {

	app.use(function (request, response, next) {
		next(messenger.makeError("page-not-found", request.user, 404));
	});

	app.use(helper.sendError);

}
