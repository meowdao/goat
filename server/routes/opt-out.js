"use strict";

import helper from "../utils/helper.js";
import middleware from "../utils/middleware.js";
import OptOutController from "../controllers/opt-out.js";


export default function(app) {

	const optOutController = new OptOutController();

	app.post("/optout/notifications", middleware.requiresLogin(), helper.simpleJSONWrapper(optOutController.change.bind(optOutController)));

}
