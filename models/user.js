"use strict";

var mongoose = require("mongoose"),
	search = require("mongoose-text-search"),
    Schema = mongoose.Schema;

var User = new Schema({
    email: String,
	name: String
}, { collection: "users", versionKey: false });

User.plugin(search);
User.index({
	name: "text"
}, {
	name: "search",
	weights: {
		name: 1
	}
});

mongoose.model("User", User);