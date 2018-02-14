import "./shared/configs/winston";
import "./shared/auth/oauth";

import winston from "winston";
import app from "./shared/configs/express";

import session from "./shared/auth/session";
import passport from "./shared/auth/passport";
import cors from "./shared/routes/cors";
import pre from "./shared/routes/pre";
import main from "./shared/routes/main";
import publicAPI from "./shared/routes/public";
import privateAPI from "./shared/routes/private";
import notFound from "./shared/routes/404";
import authorize from "./shared/routes/authorize";
import {sendError} from "./shared/utils/wrapper";
import fe from "./shared/routes/fe";


app.use(session);
app.use(passport);
app.use(cors);
app.use(pre);
app.use(main);
app.use(publicAPI);
app.use(privateAPI);
app.use(notFound);
app.use(sendError);
app.use(authorize);
app.use(fe);


const listener = app.listen(process.env.PORT, () => {
	winston.info(`Express server listening on port ${listener.address().port}`);
});

process.on("unhandledRejection", winston.error);
process.on("uncaughtException", winston.error);

export default app;
