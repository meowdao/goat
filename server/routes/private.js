import fs from "fs";
import path from "path";
import {Router} from "express";
import {makeError} from "../utils/error";
import {reMongoId} from "../utils/constants/regexp";
import {requiresLogin} from "./utils";


export default function (app, dirname, prefix) {
	const router = Router(); // eslint-disable-line new-cap

	function createRegExpParameter(re) {
		return (request, response, next, val) => {
			if (re.test(String(val))) {
				next();
			} else {
				next(makeError("invalid-param", request.user));
			}
		};
	}

	app.param("_id", createRegExpParameter(reMongoId)); // mongo id

	fs.readdirSync(path.join(dirname, `routes/${process.env.APP}/private`)).forEach(file => {
		require(path.join(dirname, `routes/${process.env.APP}/private`, file)).default(router);
	});

	// router.use(requiresLogin);
	app.use(prefix, router);
}
