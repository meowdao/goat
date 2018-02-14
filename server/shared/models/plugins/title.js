import {titleMinLength, titleMaxLength} from "../../../../shared/constants/misc";

export default function(schema) {
	schema.add({
		title: {
			minlength: [titleMinLength, "minlength"],
			maxlength: [titleMaxLength, "maxlength"],
			required: "required",
			type: String
		}
	});
}
