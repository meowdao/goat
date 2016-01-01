"use strict";

import q from "q";
import {match, RouterContext} from "react-router";

import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom/server";

import emailRoutes from "../../client/assets/js/routes/email";

// https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md

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
