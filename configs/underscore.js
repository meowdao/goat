"use strict";

var requirejs = require("requirejs"),
	_ = require("underscore");

module.exports = function (app, pkg, env) {

	var sharedRequest;

	app.use(function (request, responce, next) {
		sharedRequest = request;
		next();
	});

	function getObject(parts, create, obj) {

		if (typeof parts === "string") {
			parts = parts.split(".");
		}

		if (typeof create !== "boolean") {
			obj = create;
			create = undefined;
		}

		var p;

		while (obj && parts.length) {
			p = parts.shift();
			if (obj[p] === undefined && create) {
				obj[p] = {};
			}
			obj = obj[p];
		}

		return obj;
	}

	/**
	 * Allow underscore use of partials
	 */
	var underscorePartials = (function () {
		var partials = {};

		var mixin = {
			declare: function (name, template) {
				partials[name] = _.template(template);
			},
			partial: function (name, data) {
				return partials[name](data);
			},
			config: function (name) {
				return getObject(name, pkg);
			},
			request: function (name) {
				return sharedRequest[name];
			},
			getEnv: function () {
				return env;
			}
		};

		return mixin;

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


