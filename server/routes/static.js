import {renderAppToString, renderHTML} from "../utils/render";
import {sendError} from "../utils/helper";
import configs from "../configs/config";


export default function (app) {
	const config = configs[process.env.NODE_ENV];

	app.use((request, response) => {
		if (config.rendering === "server") {
			renderAppToString(request, response);
		} else { // client
			response.status(200).send(renderHTML());
		}
	});

	app.use(sendError);
}
