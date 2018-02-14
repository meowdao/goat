import {fullNameMinLength, fullNameMaxLength} from "../../../../shared/constants/misc";


export default function(schema) {
	schema.add({
		fullName: {
			type: String,
			required: [true, "required"],
			minlength: [fullNameMinLength, "minlength"],
			maxlength: [fullNameMaxLength, "maxlength"]
		}
	});
}
