"use strict";

import helper from "../utils/helper.js";
import middleware from "../utils/middleware.js";
import Controller from "../controllers/user.abstract.js";

export default function (app) {

    app.get("/user/profile", [middleware.requiresLogin], helper.simpleHTMLWrapper(Controller.profile));

}