"use strict";

module.exports = function (app) {

    var controller = require("../controllers/message.js"),
        helper = require("../utils/helper.js");

    app.get("/:type(message|notification|error)", helper.simpleHTMLWrapper(controller.show));

};

