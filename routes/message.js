"use strict";

import helper from "../utils/helper.js";
import Controller from "../controllers/message.js";

export default function (app) {

    app.get("/:type(message|notification|error)", helper.simpleHTMLWrapper(Controller.show));

};

