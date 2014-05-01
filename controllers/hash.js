"use strict";

var controller = require("../utils/controller.js"),
    mongoose = require("mongoose"),
    Hash = mongoose.model("Hash"),
    _ = require("lodash");

var methods = {
    getByIdAndDate: function (query) {
        return module.exports.findById(query)
            .then(function (hash) {
                var date = new Date();
                date.setDate(date.getDate() - 1);
                if (!hash || hash.date.created < date) {
                    throw "Link is expired.";
                }
                return hash;
            });
    }
};

module.exports = _.extend(controller(Hash), methods);

