"use strict";

module.exports = function (app) {

    var controller = require("../controllers/opt_out.js"),
        helper = require("../utils/helper.js"),
        middleware = require("../utils/middleware.js");

    app.get("/optout/notifications", [middleware.requiresLogin], helper.simpleJSONWrapper(controller.getNotifications));
    app.post("/optout/notifications", [middleware.requiresLogin], helper.simpleJSONWrapper(controller.postNotifications));

};
