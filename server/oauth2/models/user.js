import bcrypt from "bcrypt-nodejs";
import {Schema} from "mongoose";
import zxcvbn from "zxcvbn";
import email from "../../shared/models/plugins/email";
import fullName from "../../shared/models/plugins/fullName";
import phoneNumber from "../../shared/models/plugins/phoneNumber";
import {arrayGetter} from "../../shared/utils/mongoose";
import status from "../../shared/models/plugins/status";
import country from "../../shared/models/plugins/country";
import language from "../../shared/models/plugins/language";


const User = new Schema({
	image: {
		type: String
	},

	license: {
		type: String
	},

	permissions: {
		type: Array,
		enum: [],
		default: [],
		get: arrayGetter
	},

	password: {
		type: String,
		select: false,
		required: [true, "required"],
		validate: [{
			validator() {
				return this.isModified("password") ? this.password === this.confirm : true;
			},
			msg: "mismatch"
		}, {
			validator() {
				return !!this.password;
			},
			msg: "required"
		}, {
			validator() {
				return zxcvbn(this.password).score >= 1;
			},
			msg: "weak"
		}]
	},

	social: {
		_id: false,
		facebook: String,
		google: String,
		system: String
	}
});

User.plugin(email);
User.plugin(fullName);
User.plugin(phoneNumber);
User.plugin(status);
User.plugin(country);
User.plugin(language);

User.virtual("confirm")
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

User.methods.verifyPassword = function verifyPassword(password) {
	return bcrypt.compareSync(password, this.password);
};

export default User;
