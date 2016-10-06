import LAPI from "../../connect/lookup";

export default function (schema, {prefix}) {
	schema.add({
		phoneNumber: {
			type: String
		},
		isPhoneNumberVerified: {
			type: Boolean,
			default: false
		}
	});

	schema.pre("validate", true, function preValidatePhoneNumber(next, done) {
		if (this.isNew || this.isModified("phoneNumber")) {
			LAPI.checkPhoneNumber(done, this, prefix);
		} else {
			done();
		}
		next();
	});

	schema.pre("save", function preSavePhoneNumber(next) {
		if (this.isModified("phoneNumber") && !this.isModified("isPhoneNumberVerified")) {
			this.isPhoneNumberVerified = false;
		}
		next();
	});

	schema
		.virtual("phoneNumberLocal")
		.set(function setPhoneNumberLocal(phoneNumberLocal) {
			this._phoneNumberLocal = phoneNumberLocal;
		})
		.get(function getPhoneNumberLocal() {
			return this._phoneNumberLocal;
		});
}
