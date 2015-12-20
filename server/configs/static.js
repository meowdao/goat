"use strict";


import {renderAppToString} from "../utils/render.js";

export default function (app) {

	app.use(function (request, response) {
		renderAppToString(request, response);
	});


}
