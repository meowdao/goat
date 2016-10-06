import handlebars from "handlebars";

function checkCondition(v1, operator, v2) {
	switch (operator) {
		case "==":
			return (v1 == v2); // eslint-disable-line eqeqeq
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

handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
	return checkCondition(v1, operator, v2) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper("math", (lvalue, operator, rvalue) => {
	lvalue = parseFloat(lvalue); // eslint-disable-line no-param-reassign
	rvalue = parseFloat(rvalue); // eslint-disable-line no-param-reassign

	return {
		"+": lvalue + rvalue,
		"-": lvalue - rvalue,
		"*": lvalue * rvalue,
		"/": lvalue / rvalue,
		"%": lvalue % rvalue
	}[operator];
});

handlebars.registerHelper("moment", (context, block) => {
	let date = moment(context);
	let hasFormat = false;

	Object.keys(block.hash).forEach(key => {
		if (key === "format") {
			hasFormat = true;
		} else if (date[key]) {
			date = date[key](block.hash[key]);
		} else {
			winston.info(`moment.js does not support ${key}`);
		}
	});

	if (hasFormat) {
		date = date.format(block.hash.format);
	}

	return date;
});

handlebars.registerHelper("toJSON", (...args) => new handlebars.SafeString(`<pre>${JSON.stringify(Array.prototype.slice.call(args, 0, -1), null, "\t")}</pre>`));

handlebars.registerHelper("toDollars", number => toDollars(number));

handlebars.registerHelper("raw", options => options.fn());

export default handlebars;

export function hbs(tpl, data) {
	return handlebars.compile(tpl)(data).replace(/\s+/g, " ").replace(/^\s|\s$/g, "");
}
