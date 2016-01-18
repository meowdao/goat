"use strict";

import helper from "../utils/helper.js";
import middleware from "../utils/middleware.js";
import TwitterController from "../controllers/twitter.js";


export default function(app) {

	const twitterController = new TwitterController();

	app.get("/twitter/search", helper.simpleJSONWrapper(::twitterController.getTwits));

}
