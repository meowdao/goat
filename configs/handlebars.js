"use strict";

var hbs = require("express-hbs");

module.exports = function () {

    hbs.registerHelper("toJSON", function () {
        return new hbs.SafeString("<pre>" + JSON.stringify([].slice.call(arguments, 0, -1), null, "\t") + "</pre>");
    });

};
