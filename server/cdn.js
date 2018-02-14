import "./shared/configs/winston";

import winston from "winston";
import app from "./shared/configs/express";

import cors from "./shared/routes/cors";
import assets from "./shared/routes/assets";
import notFound from "./shared/routes/404";
import {sendError} from "./shared/utils/wrapper";

app.use(cors);
app.use(assets);
app.use(notFound);
app.use(sendError);

const listener = app.listen(process.env.PORT, () => {
	winston.info(`Express server listening on port ${listener.address().port}`);
});

process.on("unhandledRejection", winston.error);
process.on("uncaughtException", winston.error);

export default app;
