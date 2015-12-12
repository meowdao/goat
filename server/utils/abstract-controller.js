"use strict";

import _ from "lodash";
import RichModel from "./rich-model.js";
import messenger from "./messenger.js";

import DebuggableController from "./debuggable-controller.js";

class AbstractController extends DebuggableController {

	constructor(isDebuggable, connection) {
		super(isDebuggable);
		this.model = new RichModel(this.constructor.name.slice(0, -10), this.isDebuggable, connection);
	}

	getById(request) {
		return this.findOne({
				_id: request.params._id,
				user: request.user._id
			})
			.then(messenger.notFound(this.displayName, request.user));
	}

	list(request) {
		return this.find({user: request.user._id})
			.then(items => {
				return {[this.displayName + "s"]: items};
			});
	}

	insert(request, fields = []) {
		let clean = Object.assign({}, fields.length ? _.pick(request.body, fields) : request.body, {user: request.user._id});
		return this.create(clean);
	}

	edit(request, fields = []) {
		let clean = Object.assign({}, fields.length ? _.pick(request.body, fields) : request.body);
		return this.findOneAndUpdate({
				_id: request.params._id,
				user: request.user._id
			}, clean, {new: true})
			.then(messenger.notFound(this.displayName, request.user));
	}

	delete(request) {
		return this.findOneAndRemove({
				user: request.user._id,
				_id: request.params._id
			})
			.then(messenger.notFound(this.displayName, request.user))
			.thenResolve({success: true});
	}

}
; // eslint-disable-line no-extra-semi

[
	"count",
	"distinct",
	"remove",
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