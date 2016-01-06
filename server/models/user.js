"use strict";

import bcrypt from "bcrypt-nodejs";
import {Schema} from "mongoose";
import zxcvbn from "zxcvbn";
import regexp from "../utils/regexp.js";
// import LAPI from "../utils/api/lookup.js";
import lang from "../utils/lang/en.js";

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
		required: lang.error.model.user["email-is-required"],
		match: [regexp.email, lang.error.model.user["email-is-invalid"]]
	},
	isEmailVerified: {
		type: Boolean,
		default: false
	},

	/*
	phoneNumber: {
		type: String,
		required: "Phone number is required"
	},
	*/

	firstName: {
		type: String,
		required: lang.error.model.user["first-name-is-required"]
	},
	lastName: {
		type: String,
		required: lang.error.model.user["last-name-is-required"]
	},

	role: {
		type: String,
		default: "user",
		enum: {
			values: ["user", "admin"],
			message: lang.error.model.user["unrec-user-role"]
		}
	},

	password: {
		type: String,
		select: false,
		required: lang.error.model.user["password-is-required"],
		validate: [{
			validator() {
				return this.isModified("password") ? this.password === this.confirm : true;
			},
			msg: lang.error.model.user["passwords-match"]
		}, {
			validator() {
				return !!this.password;
			},
			msg: lang.error.model.user["password-is-required"]
		}, {
			validator() {
				return zxcvbn(this.password).score >= 1;
			},
			msg: lang.error.model.user["password-weak"]
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

/*
User.pre("validate", true, function(next, done) {
	LAPI.checkPhoneNumber(done, this);
	next();
});
*/

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
