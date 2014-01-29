"use strict";

module.exports = function (app, passport) {

    var controller = require("../controllers/user.js"),
        helper = require("../utils/helper.js"),
        middleware = require("../utils/middleware.js");

    // HTML
    app.get("/user/profile", [middleware.requiresLogin], helper.simpleHTMLWrapper(controller.profile));

};