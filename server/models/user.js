"use strict";

import bcrypt from "bcrypt-nodejs";
import {Schema} from "mongoose";
import zxcvbn from "zxcvbn";
import regexp from "../utils/regexp.js";

const User = new Schema({
	avatar: {
		type: Schema.Types.ObjectId,
		ref: "Avatar"
	},

	email: {
		type: String,
		lowercase: true,
		trim: true,
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
		enum: {
			values: ["user", "admin"],
			message: "Unrecognized user role"
		}
	},

	password: {
		type: String,
		select: false,
		required: "Password cannot be blank",
		validate: [{
			validator() {
				return this.isModified("password") ? this.password === this.confirm : true;
			},
			msg: "Passwords doesn't much"
		}, {
			validator() {
				return !!this.password;
			},
			msg: "Password cannot be blank"
		}, {
			validator() {
				return zxcvbn(this.password).score >= 1;
			},
			msg: "Password is too weak"
		}]
	},

	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
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
	.get(function() {
		return this.firstName + " " + this.lastName;
	});

User.virtual("confirm")
	.set(function(password) {
		this._confirm = password;
	})
	.get(function() {
		return this._confirm;
	});

User.pre("save", function(next) {
	if (this.isModified("password")) {
		this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(5));
	}
	next();
});

User.pre("save", function(next) {
	if (this.isModified("email")) {
		this.isEmailVerified = false;
	}
	next();
});

User.pre("save", function(next) {
	this.updated = new Date();
	next();
});

User.methods = {
	verifyPassword(password) {
		return bcrypt.compareSync(password, this.password);
	}
};

User.index({
	name: "text"
}, {
	name: "search",
	weights: {
		firstName: 1,
		lastName: 1,
		companyName: 1
	}
});

export default User;
