"use strict";

var hbs = require("express-hbs");

function checkCondition(v1, operator, v2) {
	/*jshint eqeqeq:false */
	switch (operator) {
		case "==":
			return (v1 == v2);
		case "===":
			return (v1 === v2);
		case "!==":
			return (v1 !== v2);
		case "<":
			return (v1 < v2);
		case "<=":
			return (v1 <= v2);
		case ">":
			return (v1 > v2);
		case ">=":
			return (v1 >= v2);
		case "&&":
			return (v1 && v2);
		case "||":
			return (v1 || v2);
		default:
			return false;
	}
}

hbs.registerHelper("ifCond", function (v1, operator, v2, options) {
	return checkCondition(v1, operator, v2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper("toJSON", function () {
	return new hbs.SafeString("<pre>" + JSON.stringify([].slice.call(arguments, 0, -1), null, "\t") + "</pre>");
});

export default hbs;
