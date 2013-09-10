"use strict";

var helper = require("./helper.js");

module.exports = function (model, defaults) {
	return {
		getById: function (query, params) {
			return helper.simpleDeferred(model.findById(query.id), params, defaults);
		},
		getWithQuery: function (query, params) {
			//console.log(model.modelName + ":getWithQuery", query, params, defaults)
			return helper.simpleDeferred(model.find(query), params, defaults);
		},
		create: function (query) {
			return helper.simpleInsert(model, query)
		},
		upsert: function (query, params) {
			return helper.simpleUpsert(model, query, params);
		},
		delete: function (query) {
			return helper.simpleDelete(model, query);
		},
		search: function (query) {
			return helper.simpleSearch(model, query);
		}
	}
};