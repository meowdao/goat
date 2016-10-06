import {sendError} from "./wrapper";


export default function (app) {
	app.use(sendError);
}
