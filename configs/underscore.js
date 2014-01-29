"use strict";

var helper = require("../utils/helper.js"),
    requirejs = require("requirejs"),
    _ = require("underscore");

module.exports = function (app, pkg, env) {

    _.mixin((function () {
        var partials = {};

        return {
            declare: function (group, name, template) {
                if (!partials[group]) {
                    partials[group] = {};
                }
                partials[group][name] = _.template(template);
            },
            partial: function (group, name, data) {
                return partials[group][name] && partials[group][name](data) || "";
            },
            config: function (name) {
                return helper.getObject(name, pkg);
            },
            getEnv: function () {
                return env;
            }
        };

    })());

    requirejs.config({baseUrl: "utils/", nodeRequire: require});

    var partials = {
        html: [
            "head",
            "header",
            "footer"
        ],
        email: [
            "footer",
            "head",
            "header"
        ]
    };

    _.forEach(partials, function (names, group) {
        _.forEach(names, function (name) {
            requirejs(["text!../views/partials/" + group + "/" + name + ".html"], function (html) {
                _.declare(group, name, html);
            });
        });
    });

};


