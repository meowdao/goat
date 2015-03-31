"use strict";

var hbs = require("express-hbs");

hbs.registerHelper("toJSON", function () {
	return new hbs.SafeString("<pre>" + JSON.stringify([].slice.call(arguments, 0, -1), null, "\t") + "</pre>");
});

export default hbs;
