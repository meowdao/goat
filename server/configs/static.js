"use strict";

import path from "path";

export default function(app) {

	app.use((request, response) => {
		response.sendFile(path.join(__dirname, "../../client/assets/html/index.html"));
	});

}
