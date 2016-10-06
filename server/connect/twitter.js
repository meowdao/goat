import Q from "q";
import winston from "winston";
import Twitter from "twit";
import {decorate, override} from "core-decorators";
import {promise} from "./abstract/decorators";
import AbstractAPI from "./abstract/abstract";


export default new class TwitterAPI extends AbstractAPI {

	static key = "TWITTER_API";

	@override
	get client() {
		return new Twitter(this.config);
	}

	@decorate(promise)
	searchTwits(path, message) {
		return Q.nfcall(::this.client.get, path, message)
			.then(res => res[0])
			.catch(e => {
				winston.debug("Twitter search error, see API", e);
				throw e;
			});
	}

};
