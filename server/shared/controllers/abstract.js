import {pick, omit} from "lodash";
import AbstractModel from "../models/abstract";
import {checkModel} from "./middleware";
import {getConnections} from "../utils/mongoose";


export const fieldsToOmit = ["_id", "createdAt", "updatedAt"];

export default class AbstractController {
	static displayName;

	static realm;

	static param = "_id";

	constructor() {
		this.constructor.displayName = this.constructor.name.slice(0, -10);
		this.model = new AbstractModel(this.constructor.displayName, getConnections()[this.constructor.realm]);
	}

	getByUId(request, options, conditions = []) {
		return this.findOne({
			[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param],
			organizations: request.user.organization
		}, options)
			.tap(this.conditions(request, [checkModel()].concat(conditions)));
	}

	insert(request, fieldsToPick = [], data = {}) {
		// don't remove _id it causes recursion and `Maximum call stack size exceeded` error
		const clean = fieldsToPick.length ? pick(request.body, fieldsToPick) : omit(request.body, fieldsToOmit);
		Object.assign(clean, data, {organizations: [request.user.organization]});
		return this.create(clean);
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
			.tap(model =>
				this.remove(model)
			);
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
	"insertMany",
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
	AbstractController.prototype[name] = function wrapper(...args) {
		return this.model[name](...args);
	};
});

