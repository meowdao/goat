"use strict";

import helper from "../utils/helper.js";
import middleware from "../utils/middleware.js";
import OptOutController from "../controllers/opt_out.js";

var optoutController = new OptOutController();

export default function (app) {

    app.post("/optout/notifications", [middleware.requiresLogin], helper.simpleJSONWrapper(optoutController.change.bind(optoutController)));

};
