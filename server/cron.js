import winston from "winston";
import {closeConnections} from "./shared/utils/mongoose";


require(`./${process.env.MODULE}/jobs/${process.env.JOB}`)
	.default()
	.then(result => {
		winston.info("OK", result.length);
	})
	.catch(e => {
		winston.info("FAIL", e);
	})
	.finally(() => closeConnections())
	.done(() => {
		winston.info("DONE");
		process.exit()
	});

process.on("unhandledRejection", winston.error);
process.on("uncaughtException", winston.error);