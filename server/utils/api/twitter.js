"use strict";

import Q from "q";
import debug from "debug";
import configs from "../../configs/config.js";
import Twitter from "twit";
import {decorate} from "core-decorators";
import {promise} from "./wrapper.js";

const config = configs[process.env.NODE_ENV];
const log = debug("log:twitter");

export default new class TwitterAPI {

	static key = "TWITTER_API";

	constructor() {
		this.client = new Twitter(config.server.twitter);
	}

	@decorate(promise)
	searchTwits(path, message) {
		return Q.nfcall(::this.client.get, path, message)
			.then(res => {
				return res[0];
			})
			.catch(e => {
				log("Twitter search error, see API", e);
				throw e;
			});
	}

}
