import langModel from "../../lang/en/model";
import {reEmail} from "../../utils/constants/regexp";

export default function (schema, {prefix, unique = true}) {
	schema.add({
		email: {
			type: String,
			required: unique && langModel[`${prefix}-email-is-required`],
			lowercase: true,
			trim: true,
			match: [reEmail, langModel[`${prefix}-email-is-invalid`]]
		},
		isEmailVerified: {
			type: Boolean,
			default: false
		}
	});

	schema.pre("save", function preSaveEmail(next) {
		if (this.isModified("email") && !this.isModified("isEmailVerified")) {
			this.isEmailVerified = false;
		}
		next();
	});

	if (unique) {
		schema.index({
			email: 1
		}, {
			unique: true,
			name: `${prefix}-email-duplicate`
		});
	}
}
