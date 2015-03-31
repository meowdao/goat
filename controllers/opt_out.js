"use strict";

import _ from "lodash";
import mongoose from "mongoose";

import AbstractController from "../utils/controller.js";

var Controller = new AbstractController(mongoose.model("OptOut"));

var methods = {
    getNotifications: function (request) {
        var types = {
            // key should be same as template name
            admin: {},
            user: {}
        };
        return module.exports.distinct("type", {user: request.user._id})
            .then(function (checked) {
                return {
                    types: types[request.user.role],
                    checked: checked
                };
            });
    },
    postNotifications: function (request) {
        var query = request.body;
        return module.exports.remove({user: request.user._id})
            .then(function () {
                return query.types ? module.exports.create(_.map(query.types, function (type) {
                    return {
                        type: type,
                        user: request.user
                    };
                })) : [];
            });
    }
};

export default _.extend(Controller, methods);
