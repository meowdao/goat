import {pick, omit} from "lodash";
import AbstractModel from "./../../models/abstract/abstract";
import {checkModel} from "../../utils/middleware";
import {getConnections} from "../../utils/mongoose";


export const fieldsToOmit = ["_id", "createdAt", "updatedAt"];

export default class AbstractController {

	static displayName;

	static realm;

	static param = "_id";

	constructor() {
		this.constructor.displayName = this.constructor.name.slice(0, -10);
		this.model = new AbstractModel(this.constructor.displayName, getConnections()[this.constructor.realm]);
	}

	getByUId(request, options) {
		return this.findOne({
			[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param],
			organizations: request.user.apiKey.organization
		}, options)
			.then(model => checkModel().bind(this)(model, request));
	}

	getById(request) {
		return this.getByUId(request);
	}

	list(request) {
		return this.find({organizations: request.user.apiKey.organization})
			.then(list => ({list}));
	}

	insert(request, fieldsToPick = [], data = {}) {
		// don't remove _id it causes recursion and `Maximum call stack size exceeded` error
		const clean = fieldsToPick.length ? pick(request.body, fieldsToPick) : omit(request.body, fieldsToOmit);
		Object.assign(clean, data, {organizations: [request.user.apiKey.organization._id]});
		return this.create(clean);
	}

	edit(request) {
		return this.change(request);
	}

	change(request, options = {}, conditions = [], fieldsToPick = [], data = {}) {
		Object.assign(options, {lean: false});
		return this.getByUId(request, options, conditions)
			.then(item => {
				const clean = fieldsToPick.length ? pick(request.body, fieldsToPick) : omit(request.body, fieldsToOmit);
				if (Object.keys(clean).length || Object.keys(data).length) {
					Object.assign(item, clean, data);
					return this.save(item);
				} else {
					return item;
				}
			});
	}

	deactivate(request) {
		return this.getByUId(request)
			.then(model =>
				this.remove(model)
			);
	}

	delete(request) {
		return this.deactivate(request)
			.thenResolve({success: true});
	}

	conditions(request, conditions = []) {
		return item => {
			conditions.forEach(condition => condition.bind(this)(item, request));
			return item;
		};
	}

}
; // eslint-disable-line no-extra-semi

[
	"aggregate",
	"count",
	"distinct",
	"create",
	"find",
	"findById",
	"findByIdAndRemove",
	"findByIdAndUpdate",
	"findOne",
	"findOneAndRemove",
	"findOneAndUpdate",
	"fulltextsearch",
	"mapReduce",
	"populate",
	"remove",
	"save",
	"update",
	"upsert"
].forEach(name => {
	AbstractController.prototype[name] = function (...args) {
		return this.model[name](...args);
	};
});

