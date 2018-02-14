import AbstractController from "./abstract";


export default class CRUDController extends AbstractController {
	getById(request) {
		return this.getByUId(request);
	}

	list(request) {
		return this.find({organizations: request.user.organization})
			.then(list => ({list, count: list.length}));
	}

	edit(request) {
		return this.change(request);
	}

	delete(request) {
		return this.deactivate(request);
	}
}
