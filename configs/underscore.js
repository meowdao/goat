"use strict";

var helper = require("../utils/helper.js"),
    requirejs = require("requirejs"),
	_ = require("underscore");

module.exports = function (app, pkg, env) {

	var sharedRequest;

	app.use(function (request, responce, next) {
		sharedRequest = request;
		next();
	});

	/**
	 * Allow underscore use of partials
	 */
	var underscorePartials = (function () {
		var partials = {};

        return {
			declare: function (name, template) {
				partials[name] = _.template(template);
			},
			partial: function (name, data) {
				return partials[name](data);
			},
			config: function (name) {
				return helper.getObject(name, pkg);
			},
			request: function (name) {
				return sharedRequest[name];
			},
			getEnv: function () {
				return env;
			}
		};

	})();

	_.mixin(underscorePartials);

	/*
	* Shared partials
	*/
	requirejs.config({baseUrl: "utils/", nodeRequire: require});

	requirejs(["text!../views/partials/head.html"], function (html) {
		_.declare("head", html);
	});

	requirejs(["text!../views/partials/header.html"], function (html) {
		_.declare("header", html);
	});

	requirejs(["text!../views/partials/footer.html"], function (html) {
		_.declare("footer", html);
	});

};


