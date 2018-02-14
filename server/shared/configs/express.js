import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import queryTypes from "query-types";
import qs from "qs";


const app = express();

app.set("query parser fn", str => queryTypes.parseObject(qs.parse(str)));
app.disable("x-powered-by");

app.use(logger("tiny")); // "default", "short", "tiny", "dev"

app.use(cookieParser("keyboardcat"));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

export default app;
