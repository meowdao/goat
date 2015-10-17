"use strict";

import helper from "../utils/helper.js";
import middleware from "../utils/middleware.js";


export default function (app) {

	let optoutController = new (require("../controllers/opt_out.js"))();

    app.post("/optout/notifications", [middleware.requiresLogin()], helper.simpleJSONWrapper(optoutController.change.bind(optoutController)));

};
