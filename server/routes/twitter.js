"use strict";

import {wrapJSON} from "../utils/helper.js";
import TwitterController from "../controllers/twitter.js";


export default function (app) {
	const twitterController = new TwitterController();

	app.get("/twitter/search", wrapJSON(::twitterController.getTwits));
}
