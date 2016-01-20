"use strict";

import "../css/styles.less";
import "../img/favicon.ico";
import "./utils/jquery.js";

import debug from "debug";
import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";
import {Provider} from "react-redux";

import Router from "./routes/router.js";
import routes from "./routes/app.js";
import store from "./utils/store.js";

import history from "./utils/history.js";


if (process.env.NODE_ENV !== "production") {
	debug.enable("web:*");
}

const initialState = window.__INITIAL_STATE__;

ReactDOM.render(
	<Provider store={store(initialState)}>
		<Router history={history} routes={routes} onUpdate={() => window.scrollTo(0, 0)}/>
	</Provider>,
	document.getElementById("app")
);
