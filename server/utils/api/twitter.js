"use strict";

import Q from "q";
import debug from "debug";
import configs from "../../configs/config.js";
import wrapper from "./wrapper.js";
import Twitter from "twit";

const config = configs[process.env.NODE_ENV];
const log = debug("log:twitter");


const TwitterClient = new Twitter(config.server.twitter);

export default function API() {

}

API.key = "TWITTER_API";

API.searchTwits = wrapper.promise(function(path, message) {
	return Q.nfcall(::TwitterClient.get, path, message)
		.then(res => {
			res[0].statuses.forEach(function(data) {
				log("Twit response id:", data.id);
			});
			return res[0];
		})
		.catch(e => {
			log("Twitter search error, see API", e);
			throw e;
		});
});
