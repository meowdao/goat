"use strict";

import helper from "../utils/helper.js";
import Controller from "../controllers/index.js";

export default function (app) {

    app.get("/", helper.simpleHTMLWrapper(Controller.index));

};