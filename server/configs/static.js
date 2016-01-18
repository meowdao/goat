"use strict";

import path from "path";
import {renderAppToString, renderHTML} from "../utils/render.js";
import configs from "../configs/config.js";


export default function(app) {

	const config = configs[process.env.NODE_ENV];

	app.use((request, response) => {
		if (config.rendering === "server") {
			renderAppToString(request, response);
		} else { // client
			response.status(200).send(renderHTML());
		}
	});

}
