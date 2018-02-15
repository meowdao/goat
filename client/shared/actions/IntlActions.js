import {localization} from "../../../shared/intl/setup";
import {SWITCH_LANGUAGE} from "../../../shared/constants/actions";


export function switchLanguage(newLang) {
	return {
		type: SWITCH_LANGUAGE,
		...localization[newLang]
	};
}
