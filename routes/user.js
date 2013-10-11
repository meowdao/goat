"use strict";

module.exports = function (app) {

    var controller = require("../controllers/user.js"),
        helper = require("../utils/helper.js"),
        middleware = require("../utils/middleware.js");

    // JSON
    app.get("/user/getById", middleware.requiresParams(["id"]), helper.simpleJSONWrapper(controller.getById));
    app.get("/user/getWithQuery", helper.simpleJSONWrapper(controller.getWithQuery));

    // HTML
    app.get("/user/profile", helper.simpleHTMLWrapper(controller.profile));

};