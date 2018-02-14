import bcrypt from "bcrypt-nodejs";
import zxcvbn from "zxcvbn";


export default function(schema) {
	schema.add({
		password: {
			type: String,
			select: false,
			required: "password-required",
			validate: [{
				validator() {
					return this.isModified("password") ? this.password === this.confirm : true;
				},
				msg: "passwords-match"
			}, {
				validator() {
					return !!this.password;
				},
				msg: "password-required"
			}, {
				validator() {
					return zxcvbn(this.password).score >= 1;
				},
				msg: "password-weak"
			}]
		}
	});

	schema
		.virtual("confirm")
		.set(function setConfirm(confirm) {
			this._confirm = confirm;
		})
		.get(function getConfirm() {
			return this._confirm;
		});

	schema.pre("save", function preSavePassword(next) {
		if (this.isModified("password")) {
			this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(5));
		}
		next();
	});

	schema.methods.verifyPassword = function verifyPassword(password) {
		return bcrypt.compareSync(password, this.password);
	};
}
