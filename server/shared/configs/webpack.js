import webpack from "webpack";
import {Router} from "express";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import configDev from "./webpack.development";
import configHot from "./webpack.hot";

const router = Router(); // eslint-disable-line new-cap

// Run Webpack dev server in only development mode
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
	const compiler = webpack(configDev);
	router.use(webpackDevMiddleware(compiler, configHot));
	router.use(webpackHotMiddleware(compiler));
}

export default router;

