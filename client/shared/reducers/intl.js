import {enabledLanguages, defaultLanguage} from "../../../shared/constants/language";
import {localization} from "../../../shared/intl/setup";
import {SWITCH_LANGUAGE} from "../actions/IntlActions";

const initLocale = global.navigator ? global.navigator.language.split("-")[0] : defaultLanguage;

const initialState = {
	locale: initLocale,
	enabledLanguages,
	...(localization[initLocale] || {})
};

export default function intlReducer(state = initialState, action) {
	switch (action.type) {
		case SWITCH_LANGUAGE: {
			const {type, ...actionWithoutType} = action; // eslint-disable-line
			return {...state, ...actionWithoutType};
		}
		default:
			return state;
	}
}
