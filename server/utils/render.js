"use strict";

import q from "q";
import {match, RouterContext} from "react-router";

import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom/server";
import HTML from "../../client/assets/js/components/HTML";

import appRoutes from "../../client/assets/js/routes/app";
import emailRoutes from "../../client/assets/js/routes/email";

// https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md

export function renderHTML(params) {
	const html = ReactDOM.renderToStaticMarkup(<HTML {...params}/>);
	return `<!doctype html>\n${html}`;
}

export function renderAppToString(request, response) {
	match({routes: appRoutes, location: request.url}, (error, redirectLocation, renderProps) => {
		if (error) {
			response.status(500).send(error.message);
		} else if (redirectLocation) {
			response.redirect(302, redirectLocation.pathname + redirectLocation.search);
		} else if (renderProps) {
			const code = renderProps.routes[1].path === "*" ? 404 : 200;
			response.status(code).send(renderHTML({dangerouslySetInnerHTML: {__html: ReactDOM.renderToStaticMarkup(<RouterContext {...renderProps} />)}}));
		}
	});
}

export function renderEmailToString(view, params) {
	const defered = q.defer();
	match({routes: emailRoutes, location: "/" + view}, (error, redirectLocation, renderProps) => {
		if (error) {
			defered.reject(error);
		} else {
			defered.resolve(ReactDOM.renderToStaticMarkup(<RouterContext {...renderProps} params={params}/>));
		}
	});
	return defered.promise;
}
