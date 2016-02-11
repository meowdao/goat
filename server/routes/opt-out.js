"use strict";

import {wrapJSON} from "../utils/helper";
import {requiresLogin} from "../utils/middleware";
import OptOutController from "../controllers/opt-out";


export default function (app) {
	const optOutController = new OptOutController();

	app.post("/optout/notifications", requiresLogin, wrapJSON(::optOutController.change));
}
