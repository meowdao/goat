"use strict";

var controller = require("../utils/controller.js"),
    messager = require("../utils/messager.js"),
    mongoose = require("mongoose"),
    Hash = mongoose.model("Hash"),
    _ = require("lodash");

var methods = {
    getByIdAndDate: function (id) {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        return module.exports.findOne({
            _id: id,
            "date.created": {$gte: date}
        })
            .then(messager.checkModel("expired-key"));
    }
};

module.exports = _.extend(controller(Hash), methods);

