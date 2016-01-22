"use strict";

import DebuggableController from "./abstract/debuggable";
import TwitterAPI from "../utils/api/twitter";

export default class TwitterController extends DebuggableController {

	getTwits(request) {
		return TwitterAPI.searchTwits("search/tweets", request.query);
	}

}
