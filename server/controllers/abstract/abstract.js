"use strict";

import _ from "lodash";
import RichModel from "./../../utils/rich-model";
import {checkModel} from "./../../utils/messenger";

import DebuggableController from "./debuggable";

class AbstractController extends DebuggableController {

	static realm = "main";

	constructor(isDebuggable = true, connection) {
		super(isDebuggable);
		// TODO strange babel bug
		connection = connection || require("../../configs/mongoose").default()[this.constructor.realm];
		this.model = new RichModel(this.constructor.name.slice(0, -10), isDebuggable, connection);
	}

	getById(request) {
		return this
			.findOne({
				_id: request.params._id,
				user: request.user._id
			})
			.then(checkModel(request.user).bind(this));
	}

	list(request) {
		return this.find({user: request.user._id})
			.then(items => ({items}));
	}

	insert(request, fields = []) {
		const clean = Object.assign({}, fields.length ? _.pick(request.body, fields) : request.body, {user: request.user._id});
		return this.create(clean);
	}

	edit(request, fields = []) {
		const clean = Object.assign({}, fields.length ? _.pick(request.body, fields) : request.body);
		return this
			.findOneAndUpdate({
				_id: request.params._id,
				user: request.user._id
			}, clean, {new: true})
			.then(checkModel(request.user).bind(this));
	}

	delete(request) {
		return this
			.findOneAndRemove({
				user: request.user._id,
				_id: request.params._id
			})
			.then(checkModel(request.user).bind(this))
			.thenResolve({success: true});
	}

}
; // eslint-disable-line no-extra-semi

[
	"count",
	"distinct",
	"remove",
	"destroy",
	"create",
	"aggregate",
	"mapReduce",
	"find",
	"findOne",
	"findById",
	"findByIdAndRemove",
	"findByIdAndUpdate",
	"findOneAndRemove",
	"findOneAndUpdate",
	"populate",
	"update",
	"search",
	"save",
	"upsert"
].forEach(name => {
	AbstractController.prototype[name] = function (...args) {
		return this.model[name](...args);
	};
});

export default AbstractController;
