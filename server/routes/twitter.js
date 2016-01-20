"use strict";

import {simpleJSONWrapper} from "../utils/helper.js";
import TwitterController from "../controllers/twitter.js";


export default function (app) {
	const twitterController = new TwitterController();

	app.get("/twitter/search", simpleJSONWrapper(::twitterController.getTwits));
}
