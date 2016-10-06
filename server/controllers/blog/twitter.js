import TwitterAPI from "../../connect/twitter";


export default class TwitterController {

	static getTwits(request) {
		return TwitterAPI.searchTwits("search/tweets", request.query)
			.then(result => ({
				toJSON() {
					return result;
				}
			}));
	}

}
