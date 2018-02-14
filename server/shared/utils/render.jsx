import React from "react";
import {renderToStaticMarkup, renderToString} from "react-dom/server";
import {Provider} from "react-redux";
import {StaticRouter} from "react-router";
import IntlWrapper from "../../../shared/intl/IntlWrapper";


export function renderInitialMarkup(url, store, context, App) {
	return renderToString(
		<Provider store={store}>
			<IntlWrapper>
				<StaticRouter location={url} context={context}>
					<App />
				</StaticRouter>
			</IntlWrapper>
		</Provider>
	);
}

export function renderHTML(initialMarkup, store, Wrapper) {
	return `<!doctype html>\n${renderToStaticMarkup(
		<Wrapper initialMarkup={initialMarkup} initialState={store.getState()}/>
	)}`;
}
