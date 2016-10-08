import bcrypt from "bcrypt-nodejs";
import {Schema} from "mongoose";
import zxcvbn from "zxcvbn";
import {reEmail} from "../../utils/constants/regexp";
import email from "../plugins/email";
// import phoneNumber from "../plugins/phoneNumber";
import langModel from "../../lang/en/model";

import UserController from "../../controllers/user/user";


const statuses = UserController.statuses;

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
		required: langModel["email-is-required"],
		match: [reEmail, langModel["email-is-invalid"]]
	},
	isEmailVerified: {
		type: Boolean,
		default: false
	},

	fullName: {
		type: String,
		required: langModel["full-name-is-required"]
	},

	status: {
		type: String,
		enum: Object.keys(statuses).map(key => statuses[key]),
		default: statuses.inactive
	},

	role: {
		type: String,
		default: "user",
		enum: {
			values: ["user", "admin"],
			message: langModel["unrec-user-role"]
		}
	},

	password: {
		type: String,
		select: false,
		required: langModel["password-is-required"],
		validate: [{
			validator() {
				return this.isModified("password") ? this.password === this.confirm : true;
			},
			msg: langModel["passwords-match"]
		}, {
			validator() {
				return !!this.password;
			},
			msg: langModel["password-is-required"]
		}, {
			validator() {
				return zxcvbn(this.password).score >= 1;
			},
			msg: langModel["password-weak"]
		}]
	},

	facebook: {
		type: Schema.Types.Mixed,
		select: false
	},
	google: {
		type: Schema.Types.Mixed,
		select: false
	},
	goat: {
		type: Schema.Types.Mixed,
		select: false
	}

}, {
	timestamps: true,
	versionKey: false
});

User.plugin(email, {prefix: "user", unique: true});
// User.plugin(phoneNumber, {prefix: "user"});

User
	.virtual("confirm")
	.set(function setConfirm(confirm) {
		this._confirm = confirm;
	})
	.get(function getConfirm() {
		return this._confirm;
	});

User.pre("save", function preSavePassword(next) {
	if (this.isModified("password")) {
		this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(5));
	}
	next();
});

User.pre("save", function preSaveEmail(next) {
	if (this.isModified("email") && !this.isModified("isEmailVerified")) {
		this.isEmailVerified = false;
	}
	next();
});

/*
User.pre("validate", true, function(next, done) {
	LAPI.checkPhoneNumber(done, this);
	next();
});
*/

User.methods.verifyPassword = function verifyPassword(password) {
	return bcrypt.compareSync(password, this.password);
};

User.index({
	name: "text"
}, {
	name: "search",
	weights: {
		fullName: 1
	}
});

export default User;
