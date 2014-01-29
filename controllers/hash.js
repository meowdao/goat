"use strict";

var controller = require("../utils/controller.js"),
    mongoose = require("mongoose"),
    Hash = mongoose.model("Hash"),
    _ = require("underscore");

var methods = {
    getByIdAndDate: function (query) {
        var date = new Date();
        date.setDate(date.getDate() - 1);

        var clean = {
            _id: query.hash,
            date_created: {"$gte": date}
        };
        // TODO getById
        return module.exports.getOne(clean)
            .then(function (hash) {
                if (!hash) {
                    throw {
                        messages: ["Link is expired."]
                    };
                }
                return hash;
            });
    }
};

module.exports = _.extend(controller(Hash), methods);

