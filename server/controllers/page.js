"use strict";

import marked from "marked";
import StatefulController from "./abstract/stateful.js";


export default class PageController extends StatefulController {

	static param = "pageId";

	constructor() {
		super(...arguments);
		marked.setOptions({
			sanitize: true
		});
	}

	getById(request) {
		return this.check(request)
			.then(page => {
				const obj = page.toObject();
				obj.text = marked(obj.text);
				return obj;
			});
	}

}
