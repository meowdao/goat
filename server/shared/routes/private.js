import fs from "fs";
import path from "path";
import {Router} from "express";
import {makeError} from "../utils/error";
import {reMongoId} from "../../../shared/constants/regexp";
import {requiresLogin} from "../utils/middleware";

function createRegExpParameter(re, name) {
	return (request, response, next, val) => {
		if (re.test(String(val))) {
			next();
		} else {
			next(makeError("invalid-param", 400, {name, reason: "invalid"}));
		}
	};
}

const router = Router(); // eslint-disable-line new-cap

router.param("_id", createRegExpParameter(reMongoId, "_id")); // mongo id

router.use("/api", requiresLogin);

fs.readdirSync(path.join(__dirname, `../../${process.env.MODULE}/routes/private`)).forEach(file => {
	router.use("/api", require(path.join(__dirname, `../../${process.env.MODULE}/routes/private`, file)).default);
});

export default router;
