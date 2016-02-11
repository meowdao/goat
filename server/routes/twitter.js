"use strict";

import {wrapJSON} from "../utils/helper";
import TwitterController from "../controllers/twitter";


export default function (app) {
	const twitterController = new TwitterController();

	app.get("/twitter/search", wrapJSON(::twitterController.getTwits));
}
