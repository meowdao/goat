import q from "q";
import _ from "lodash";
import AbstractUserController from "../abstract/user";
import {setRegExp} from "../../utils/request";

export default class UserController extends AbstractUserController {

	static realm = "user";

	sync(request) {
		return q(request.isAuthenticated() ? request.user.toJSON({virtuals: true}) : {authenticated: false});
	}

	list(request) {
		const query = request.query;
		const {skip, limit} = query;
		const clean = {};
		setRegExp(clean, query, ["email"]);
		return q.all([
			this.find(clean, {skip, limit}),
			this.count(clean)
		])
			.spread((list, count) => ({list, count}));
	}

	change(request) {
		return this.findById(request.params._id, {lean: false})
			.then(user => {
				const query = request.body;
				const clean = _.pick(query, ["fullName", "email", "isActive", "role", "password", "confirm"]);
				Object.assign(user, clean);
				return this.save(user);
			});
	}

	edit(request) {
		const query = request.body;
		const clean = _.pick(query, ["fullName"]);
		Object.assign(request.user, clean);
		return this.save(request.user);
	}

	getByQuery(query) {
		return this.findOne(query, {
			lean: false
		});
	}

}
