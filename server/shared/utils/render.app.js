import HTML from "../../../client/shared/HTML";
import {localization} from "../../../shared/intl/setup";
import {defaultLanguage, enabledLanguages} from "../../../shared/constants/language";
import {renderInitialMarkup, renderHTML} from "./render";


const App = require(`../../../client/${process.env.MODULE}/app`).default;
const configureStore = require(`../../../client/${process.env.MODULE}/store`).default;


export function renderAppToString(request, response) {

	const initLocale = request.user ? request.user.language : defaultLanguage;
	const preloadedState = {
		intl: {
			locale: initLocale,
			enabledLanguages,
			...(localization[initLocale] || {})
		}
	};
	if (request.user) {
		Object.assign(preloadedState, {user: request.user.toJSON()});
	}
	if (request.oauth2) {
		Object.assign(preloadedState, {oauth2: request.oauth2});
	}

	const store = configureStore(preloadedState);

	const context = {};

	const initialMarkup = renderInitialMarkup(request.url, store, context, App);

	// context.url will contain the URL to redirect to if a <Redirect> was used
	if (context.url) {
		response.redirect(302, context.url);
	} else {
		response.status(200).send(renderHTML(initialMarkup, store, HTML));
	}
}

