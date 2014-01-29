"use strict";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var OptOut = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    date: {
        _id: false,
        created: {type: Date, default: Date.now}
    },
    type: String
}, { collection: "test_optuot", versionKey: false });

module.exports = OptOut;
