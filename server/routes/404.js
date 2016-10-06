import {makeError} from "../utils/error";


export default function (app) {
	app.use((request, response, next) => {
		next(makeError("server.page-not-found", request.user, 404));
	});
}
