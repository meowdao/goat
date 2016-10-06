import StatefulController from "../abstract/stateful";


export default class PageController extends StatefulController {

	static realm = "blog";

	static param = "pageId";

	constructor() {
		super(...arguments);
	}

	getById(request) {
		return this.check(request);
	}

}
