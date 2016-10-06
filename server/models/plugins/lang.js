import {getAvailableLanguages, getDefaultLanguage} from "../../utils/lang";


export default function (schema) {
	schema.add({
		lang: {
			type: String,
			enum: getAvailableLanguages(),
			default: getDefaultLanguage()
		}
	});
}
