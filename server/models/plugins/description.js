import langModel from "../../lang/en/model";
import {descriptionMinLength, descriptionMaxLength} from "../../utils/constants/misc";

export default function (schema, {prefix}) {
	schema.add({
		originalDescription: String,
		description: {
			type: String,
			required: langModel[`${prefix}-description-is-required`],
			default: "",
			minlength: [descriptionMinLength, langModel[`${prefix}-description-lt-minlength`]],
			maxlength: [descriptionMaxLength, langModel[`${prefix}-description-gt-maxlength`]],
			set(description) {
				if (!this.isNew && this.description !== description) {
					this._isDescriptionChanged = true;
				}
				return description;
			},
			get(description) {
				return description;
			}
		}
	});

	schema.virtual("isDescriptionChanged")
		.get(function getIsDescriptionChanged() {
			return !!this._isDescriptionChanged;
		});

	schema.pre("save", function preSaveOriginal(next) {
		if (this.isNew) {
			this.originalDescription = this.description;
		}
		next();
	});
}
