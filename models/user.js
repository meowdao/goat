"use strict";

import bcrypt from "bcrypt-nodejs";
import {Schema} from "mongoose";
import regexp from "../utils/regexp.js";

// last is first
var password_validator = [
	{
		validator: function () {
			return this.password === this.confirm;
		},
		msg: "Passwords doesn't much"
	},
	{
		validator: function () {
			return regexp.numbers.test(this.password);
		},
		msg: "Passwords should contains numbers"
	},
	{
		validator: function () {
			return regexp.upper.test(this.password);
		},
		msg: "Passwords should contains upper case letters"
	},
	{
		validator: function () {
			return regexp.lower.test(this.password);
		},
		msg: "Passwords should contains lower case letters"
	},
	{
		validator: function () {
			return !!this.password;
		},
		msg: "Password cannot be blank"
	}
];

var User = new Schema({
	avatar: {
		type: Schema.Types.ObjectId,
		ref: "Avatar"
	},

	email: {
		type: String,
		unique: true,
		required: "Email cannot be blank",
		match: [regexp.email, "Email is invalid"]
	},
	isEmailVerified: {
		type: Boolean,
		default: false
	},

	firstName: {
		type: String,
		required: "First name cannot be blank"
	},
	lastName: {
		type: String,
		required: "Last name cannot be blank"
	},

	role: {
		type: String,
		default: "user",
		enum: ["user", "admin"]
	},

	password: {
		type: String,
		validate: password_validator
	},

	date: {
		_id: false,
		created: {
			type: Date,
			default: Date.now
		},
		updated: {
			type: Date,
			default: Date.now
		}
	},

	facebook: {
		type: Schema.Types.Mixed,
		select: false
	},
	google: {
		type: Schema.Types.Mixed,
		select: false
	}

}, {versionKey: false});

User.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

User.virtual("confirm")
	.set(function (password) {
		this._confirm = password;
	})
	.get(function () {
		return this._confirm;
	});

User.pre("save", function (next) {
	if (this.isModified("password")) {
		this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(5));
	}
	next();
});

User.pre("save", function (next) {
	if (this.isModified("email")) {
		this.isEmailVerified = false;
	}
	next();
});

User.pre("save", function (next) {
	this.date.updated = new Date();
	next();
});

User.methods = {
	verifyPassword: function (password) {
		return bcrypt.compareSync(password, this.password);
	}
};

User.index({
	name: "text"
}, {
	name: "search",
	weights: {
		name: 1
	}
});

export default User;