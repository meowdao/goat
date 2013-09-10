"use strict";

module.exports = function (app) {

    var controller = require("../controllers/index.js"),
        helper = require("../utils/helper.js");

    // HTML
    app.get("/", helper.simpleHTMLWrapper(controller.index));

};