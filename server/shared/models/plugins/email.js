import {reEmail} from "../../../../shared/constants/regexp";


export default function(schema, {unique = true, required = true, verified = true} = {}) {
	schema.add({
		email: {
			lowercase: true,
			match: [reEmail, "invalid"],
			required: [required, "required"],
			trim: true,
			type: String
		}
	});

	if (unique) {
		schema.index({email: 1}, {
			unique,
			name: "email-duplicate"
		});
	}

	if (verified) {
		schema.add({
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
	}
}
