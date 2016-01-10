"use strict";

import "../css/styles.less";
import "../img/favicon.ico";

import debug from "debug";
import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";
import {Router, browserHistory} from "react-router";


import routes from "./routes/app.js";
import $ from "./utils/jquery.js"; // eslint-disable-line no-unused-vars


if (process.env.NODE_ENV !== "production") {
	debug.enable("web:*");
}

ReactDOM.render(<Router history={browserHistory} routes={routes}/>, document.getElementById("app"));
