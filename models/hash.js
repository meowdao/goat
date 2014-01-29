"use strict";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var Hash = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    date: {
        _id: false,
        created: {type: Date, default: Date.now}
    }
}, { collection: "test_hash", versionKey: false });

module.exports = Hash;
