"use strict";

require("../css/styles.less");

import debug from "debug";
import React from "react"
import $ from "./utils/jquery.js";

import bootstrap from "bootstrap";
import GOAT from "./components/GOAT"


if (process.env.NODE_ENV !== "production") {
	debug.enable("web:*");
}

$(window).on("beforeunload", function () {
	window.scrollTo(0, 0);
}, false);

$(function () {
	React.render(
		<GOAT />,
		document.getElementById("app")
	);
}, false);


