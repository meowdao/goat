import {renderHTML} from "../utils/render";
import {renderAppToString} from "../utils/render.app";
import configs from "../configs/config";
import HTML from "../../../client/shared/HTML";


export default function renderFE(request, response) {
	const config = configs[process.env.NODE_ENV];
	if (config.rendering === "server") {
		renderAppToString(request, response);
	} else { // client
		response.status(200).send(renderHTML("", {
			getState: () => ({})
		}), HTML);
	}
}
