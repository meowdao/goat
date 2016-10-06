import fs from "fs";
import path from "path";
import {Router} from "express";

export default function (app, dirname, prefix) {
	const router = Router(); // eslint-disable-line new-cap

	fs.readdirSync(path.join(dirname, `routes/${process.env.APP}/public`)).forEach(file => {
		require(path.join(dirname, `routes/${process.env.APP}/public`, file)).default(router);
	});

	app.use(prefix, router);
}
