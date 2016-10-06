import q from "q";
import {Provider} from "react-redux";
import {match, RouterContext} from "react-router";
import {renderToStaticMarkup, renderToString} from "react-dom/server";
import React from "react"; // eslint-disable-line no-unused-vars
import HTML from "../../client/assets/js/components/HTML";
import configs from "../configs/config";


import appRoutes from "../../client/assets/js/routes/app";
import emailRoutes from "../../client/assets/js/routes/email";
import configureStore from "../../client/assets/js/utils/store";

export function renderHTML(params) {
	const html = renderToStaticMarkup(<HTML {...params} />);
	return `<!doctype html>\n${html}`;
}

export function render(fn, renderProps, store) {
	return fn(
		<Provider store={store}>
			<RouterContext { ...renderProps } />
		</Provider>
	);
}

export function renderAppToString(request, response) {
	match({routes: appRoutes, location: request.url}, (error, redirectLocation, renderProps) => {
		if (error) {
			response.status(500).send(error.message);
		} else if (redirectLocation) {
			response.redirect(302, redirectLocation.pathname + redirectLocation.search);
		} else if (renderProps) {
			const store = configureStore({user: request.user});
			const initialMarkup = render(renderToString, renderProps, store);
			response.status(200).send(renderHTML({initialMarkup, initialState: store.getState()}));
		} else {
			response.status(404).send("Not found");
		}
	});
}

export function renderEmailToString(view, data) {
	const defered = q.defer();
	match({routes: emailRoutes, location: `/${view}`}, (error, redirectLocation, renderProps) => {
		if (error) {
			defered.reject(error);
		} else {
			defered.resolve(render(renderToStaticMarkup, renderProps, configureStore(data)));
		}
	});
	return defered.promise;
}

export function renderPage(request, response) {
	const config = configs[process.env.NODE_ENV];
	if (config.rendering === "server") {
		renderAppToString(request, response);
	} else { // client
		response.status(200).send(renderHTML());
	}
}
