"use strict";

import Q from "q";

export default class AbstractController {

	constructor(model, defaults) {
		this.model = model;
		this.defaults = defaults;
	}

	static enchant(query, options, defaults) {
		options = Object.assign({lean: true}, defaults, options);
		Object.keys(options).forEach(function (method) {
			query[method](options[method]);
		});
		return Q.nbind(query.exec, query)();
	}

	findById(id, options) {
		return this.constructor.enchant(this.model.findById(id), options, this.defaults);
	}

	find(query, options) {
		return this.constructor.enchant(this.model.find.apply(this.model, [].concat(query || {})), options, this.defaults);
	}

	findOne(query, options) {
		return this.constructor.enchant(this.model.findOne(query), options, this.defaults);
	}

	update(query, update, options) {
		return Q.nbind(this.model.update, this.model)(query, update, Object.assign({
			strict: true,
			multi: true
		}, options)).get(0);
	}

	populate(list, path, options) {
		return Q.nbind(this.model.populate, this.model)(list, [{
			path: path,
			options: options || {}
		}]);
	}

	insert(request) {
		return this.create(request.method === "POST" || request.method === "PUT" ? request.body : request.query);
	}

	search(text) {
		return this.find({$text: {$search: text}});
	}

	save(model) {
		return Q.denodeify(model.save, model)().get(0);
	}

};

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
		AbstractController.prototype[name] = function () {
			return Q.nfapply(this.model[name].bind(this.model), Array.prototype.slice.call(arguments));
		};
	});

