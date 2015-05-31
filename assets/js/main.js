"use strict";

require("../css/styles.less");

import debug from "debug";
import React from "react";

import router from "./utils/router.js";
import $ from "./utils/jquery.js";


if (process.env.NODE_ENV !== "production") {
	debug.enable("web:*");
}

$(()=> {
	router.run((Handler, state) => {
		React.render(<Handler {...state}/>, document.body);
	});
});



