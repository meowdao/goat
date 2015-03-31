"use strict";

import helper from "../utils/helper.js";
import middleware from "../utils/middleware.js";
import Controller from "../controllers/opt_out.js";

export default function (app) {

    app.get("/optout/notifications", [middleware.requiresLogin], helper.simpleJSONWrapper(Controller.getNotifications));
    app.post("/optout/notifications", [middleware.requiresLogin], helper.simpleJSONWrapper(Controller.postNotifications));

};
