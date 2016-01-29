"use strict";

import {wrapJSON} from "../utils/helper.js";
import {requiresLogin} from "../utils/middleware.js";
import OptOutController from "../controllers/opt-out.js";


export default function (app) {
	const optOutController = new OptOutController();

	app.post("/optout/notifications", requiresLogin, wrapJSON(::optOutController.change));
}
