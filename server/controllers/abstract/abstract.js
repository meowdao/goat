"use strict";

import _ from "lodash";
import path from "path";
import RichModel from "./model";
import DebuggableController from "./debuggable";
import {checkModel} from "../../utils/messenger";


class AbstractController extends DebuggableController {

	static realm;

	constructor(isDebuggable = true, connection) {
		super(isDebuggable);
		// i'm very sorry for this hack
		const config = require(path.join(process.env.PWD, "server/configs/config")).default[process.env.NODE_ENV];
		const mongoose = require(path.join(process.env.PWD, "server/configs/mongoose")).default(config);
		this.constructor.realm = this.constructor.realm || config.realm;
		this.model = new RichModel(this.constructor.displayName, isDebuggable, connection || mongoose[this.constructor.realm]);
	}

	getById(request) {
		return this.findOne({
				_id: request.params._id,
				[this.constructor.realm]: request.user._id
			})
			.then(checkModel(request.user).bind(this));
	}

	list(request) {
		return this.find({[this.constructor.realm]: request.user._id})
			.then(list => ({list}));
	}

	insert(request, fields = []) {
		// don't remove _id it causes recursion and `Maximum call stack size exceeded` error
		const clean = Object.assign({}, fields.length ? _.pick(request.body, fields) : request.body, {[this.constructor.realm]: request.user._id});
		return this.create(clean);
	}

	edit(request, fields = []) {
		const clean = Object.assign({}, fields.length ? _.pick(request.body, fields) : request.body);
		return this.findOneAndUpdate({
				_id: request.params._id,
				[this.constructor.realm]: request.user
			}, clean, {new: true})
			.then(checkModel(request.user).bind(this));
	}

	delete(request) {
		return this.findOneAndRemove({
				_id: request.params._id,
				[this.constructor.realm]: request.user
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
