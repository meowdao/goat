import {enabledLanguages, defaultLanguage} from "../../../../shared/constants/language";


export default function(schema) {
	schema.add({
		language: {
			default: defaultLanguage,
			enum: {
				values: enabledLanguages,
				message: "invalid"
			},
			type: String
		}
	});
}
