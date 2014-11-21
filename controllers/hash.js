"use strict";

var controller = require("../utils/controller.js"),
    messager = require("../utils/messager.js"),
    mongoose = require("mongoose"),
    Hash = mongoose.model("Hash"),
    _ = require("lodash");

var methods = {
    getByIdAndDate: function (query) {
        return module.exports.findById(query)
            .then(function (hash) {
                var date = new Date();
                date.setDate(date.getDate() - 1);
                messager.makeError("expired-key", hash && hash.date.created >= date);
                return hash;
            });
    }
};

module.exports = _.extend(controller(Hash), methods);

