import csrf from "csurf";
import winston from "winston";


export default function (app) {
	if (process.env.NODE_ENV !== "test") {
		app.use(csrf());
		app.use((request, response, next) => {
			winston.debug("XSRF-TOKEN", request.csrfToken());
			response.cookie("XSRF-TOKEN", request.csrfToken());
			next();
		});
	}
}
