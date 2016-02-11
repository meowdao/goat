"use strict";

import "../css/styles.less";
import "../img/favicon.ico";

import debug from "debug";
import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";
import {Provider} from "react-redux";

import {Router} from "react-router";
import routes from "./routes/app";
import configureStore from "./utils/store";
import configureJquery from "./utils/jquery";

import history from "./utils/history";


if (process.env.NODE_ENV !== "production") {
	debug.enable("web:*");
}

const store = configureStore(window.__INITIAL_STATE__);
configureJquery(store);

ReactDOM.render(
	<Provider store={store}>
		<Router history={history} routes={routes} onUpdate={() => window.scrollTo(0, 0)}/>
	</Provider>,
	document.getElementById("app")
);
