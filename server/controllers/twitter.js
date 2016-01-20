"use strict";

import DebuggableController from "./abstract/debuggable";
import TwitterAPI from "../utils/api/twitter";

export default class TwitterController extends DebuggableController {

	getTwits(request) {
		const twitter = new TwitterAPI();
		return twitter.searchTwits("search/tweets", request.query);
	}

}
