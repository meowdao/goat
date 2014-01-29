"use strict";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var Avatar = new Schema({
    url: String
}, { collection: "test_avatar", versionKey: false });

module.exports = Avatar;
