import langModel from "../../lang/en/model";
import {titleMinLength, titleMaxLength} from "../../utils/constants/misc";

export default function (schema, {prefix}) {
	schema.add({
		originalTitle: String,
		title: {
			type: String,
			required: langModel[`${prefix}-title-is-required`],
			default: "",
			minlength: [titleMinLength, langModel[`${prefix}-title-lt-minlength`]],
			maxlength: [titleMaxLength, langModel[`${prefix}-title-gt-maxlength`]]
		}
	});
}
