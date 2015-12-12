"use strict";

import proxy from "proxy-middleware";


export default function (app) {

	app.enable("trust proxy");
	app.use("/assets", proxy("http://localhost:3001/assets"));

}
