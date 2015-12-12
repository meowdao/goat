"use strict";

import '../css/styles.less';

import debug from "debug";
import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";
import {Router} from "react-router";
import {createHistory, createHashHistory} from "history";

import routes from "./utils/routes.js";
import $ from "./utils/jquery.js";


if (process.env.NODE_ENV !== "production") {
	debug.enable("web:*");
}

$(() => {
	let history = createHashHistory({queryKey: false});
	//history.pushState(null, "/");
	ReactDOM.render(<Router history={history} routes={routes}/>, document.getElementById("app"));
});



