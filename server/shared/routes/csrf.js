import csrf from "csurf";
import winston from "winston";
import {Router} from "express";

const router = Router(); // eslint-disable-line new-cap


if (process.env.NODE_ENV !== "test") {
	router.use(csrf());
	router.use((request, response, next) => {
		winston.info("XSRF-TOKEN", request.csrfToken());
		response.cookie("XSRF-TOKEN", request.csrfToken());
		next();
	});
}

export default router;
