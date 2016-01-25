"use strict";

import Q from "q";
import debug from "debug";
import Twitter from "twit";
import {decorate, override} from "core-decorators";
import {promise} from "./wrapper.js";
import DebugableAPI from "./debugable.js";

const log = debug("log:twitter");

export default new class TwitterAPI extends DebugableAPI {

	static key = "TWITTER_API";

	@override
	getClient() {
		return new Twitter(this.config);
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
