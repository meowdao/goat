import {Router} from "express";

const router = Router(); // eslint-disable-line new-cap

router.use((request, response, next) => {
	if (request.method === "OPTIONS") {
		response.status(200).send("");
		return;
	}
	next();
});

/*
app.use((request, response, next) => {
	if (request.method === "POST" || request.method === "PUT") {
		if (!request.get("Origin")) {
			return next(makeError("no-origin"));
		}
	}
	next();
});
*/

export default router;
