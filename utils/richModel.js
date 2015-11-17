"use strict";

import Q from "q";
import mongoose from "mongoose";
import debug from "debug";

export default class RichModel {

	constructor(displayName, isDebuggable, connection = mongoose) {
		this.displayName = displayName;
		this.model = connection.model(displayName);
		this.isDebuggable = isDebuggable;
		this.log = debug(`model:${this.displayName}`);
	}

	_log(where) {
		return (...args) => {
			if (this.isDebuggable) {
				this.log(where, ...args);
			}
		};
	}

	static enchant(query, options) {
		options = Object.assign({lean: true}, options);
		Object.keys(options).forEach(method => {
			if (Array.isArray(options[method])) {
				options[method].forEach(item => {
					query[method](item);
				});
			} else {
				query[method](options[method]);
			}
		});
		return Q.nbind(query.exec, query)();
	}

	findById(id, options) {
		return this.constructor.enchant(this.model.findById(id), options)
			.tap(this._log(`${this.displayName}:found`));
	}

	find(query, options) {
		return this.constructor.enchant(this.model.find(query), options)
			.tap(this._log(`${this.displayName}s:found`));
	}

	findOne(query, options) {
		return this.constructor.enchant(this.model.findOne(query), options)
			.tap(this._log(`${this.displayName}:found`));
	}

	update(query, update, options) {
		return Q.nbind(this.model.update, this.model)(query, update, Object.assign({
			strict: true,
			multi: true,
			runValidators: true
		}, options))
			.tap(this._log(`${this.displayName}:updated`));
	}

	populate(list, path, options) {
		return Q.nbind(this.model.populate, this.model)(list, [{
			path: path,
			options: options || {}
		}]);
	}

	search(text) {
		return this.find({$text: {$search: text}})
			.tap(this._log(`${this.displayName}:found`));
	}

	save(model) {
		return Q.denodeify(model.save, model)()
			.get(0)
			.tap(this._log(`${this.displayName}:saved`));
	}

}; // eslint-disable-line no-extra-semi

[
	"count",
	"distinct",
	"remove",
	"create",
	"aggregate",
	"mapReduce",
	"findByIdAndRemove",
	"findByIdAndUpdate",
	"findOneAndRemove",
	"findOneAndUpdate"
].forEach(name => {
		RichModel.prototype[name] = function (...args) {
			return Q.nfapply(this.model[name].bind(this.model), args)
				.then(result => {
					if (name === "remove") {
						return result.result;
					}
					return result;
				})
				.tap(this._log(`${this.displayName}${name[name.length - 1] === "e" ? "d" : "ed"}:${name}`));
		};
	});

