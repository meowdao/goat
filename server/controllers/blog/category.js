import {pick} from "lodash";
import {paginate} from "../../utils/response";
import StatefulController from "../abstract/stateful";


export default class CategoryController extends StatefulController {

	static realm = "blog";

	static param = "categoryId";

	list(request, response) {
		return paginate(request, response, this);
	}

	insert(request) {
		const clean = pick(request.body, ["title", "categoryId", "parent", "order"]);
		return this.create(clean);
	}

	getById(request) {
		return this.findOne({[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param]}, {
			lean: false,
			populate: ["parent"]
		});
	}

	delete(request) {
		return this
			.findByIdAndRemove(request.params._id, {
				lean: false,
				populate: ["parents"]
			})
			.then(() => {
				this.update({}, {$pull: {parants: request.params._id}});
			});
	}

}
