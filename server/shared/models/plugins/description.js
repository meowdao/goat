import {descriptionMinLength, descriptionMaxLength} from "../../../../shared/constants/misc";

export default function(schema, {required = true} = {}) {
	schema.add({
		description: {
			maxlength: [descriptionMaxLength, "maxlength"],
			minlength: [descriptionMinLength, "minlength"],
			required: [required, "required"],
			type: String
		}
	});
}
