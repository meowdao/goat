import bluebird from "bluebird";
import {makeError} from "./error";
import EML from "../../../client/shared/EML";
import {renderInitialMarkup, renderHTML} from "./render";

import App from "../../../client/email/app";
import configureStore from "../../../client/email/store";


export function renderEmailToString(view, data) {
	return new bluebird.Promise((resolve, reject) => {
		const store = configureStore(data, "email");
		const context = {};

		const initialMarkup = renderInitialMarkup(`/${view}`, store, context, App);

		if (context.url) {
			reject(makeError("email-not-found"));
		} else {
			resolve(renderHTML(initialMarkup, store, EML));
		}
	});
}
