"use strict";

import DebuggableController from "./abstract/debuggable";
import TAPI from "../utils/api/twitter";

export default class TwitterController extends DebuggableController {

	getTwits(request) {
		return TAPI.searchTwits("search/tweets", request.query);
	}

}
