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

	_.mixin((function () {
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

    })());

    requirejs.config({baseUrl: "utils/", nodeRequire: require});

    var partials = [
        "head",
        "header",
        "footer"
    ];

    _.forEach(partials, function (name) {
        requirejs(["text!../views/partials/" + name + ".html"], function (html) {
            _.declare(name, html);
        });
    });

};


