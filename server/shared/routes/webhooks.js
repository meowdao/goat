import fs from "fs";
import path from "path";
import {Router} from "express";


const router = Router(); // eslint-disable-line new-cap

fs.readdirSync(path.join(__dirname, `../../${process.env.MODULE}/routes/webhooks`)).forEach(file => {
	router.use("/api", require(path.join(__dirname, `../../${process.env.MODULE}/routes/webhooks`, file)).default);
});

export default router;

