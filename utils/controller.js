"use strict";

var helper = require("./helper.js"),
    Q = require("q");

module.exports = function (model, defaults) {
    return {
        getById: function (query, params) {
            return helper.simpleDeferred(model.findById(query[model.modelName.toLowerCase()]), params, defaults);
        },
        getWithQuery: function (query, params) {
            return helper.simpleDeferred(model.find.apply(model, [].concat(query || {})), params, defaults);
        },
        getOne: function (query, params) {
            return helper.simpleDeferred(model.findOne(query), params, defaults);
        },
        getCount: function (query) {
            return helper.simpleDeferred(model.count(query));
        },
        create: function (query) {
            return this.insert(query);
        },
        insert: function (query) {
            var deferred = Q.defer();
            model.create(query, helper.simpleCallback(deferred));
            return deferred.promise;
        },
        update: function (query, params) {
            return helper.simpleDeferred(model.update(query, params, {strict: true, multi: true}));
        },
        upsert: function (query, params) {
            return helper.simpleDeferred(model.update(query, params, {strict: true, upsert: true}));
        },
        delete: function (query) {
            return helper.simpleDeferred(model.remove(query));
        },
        search: function (query) {
            var deferred = Q.defer();
            model.textSearch(query.q, helper.simpleCallback(deferred));
            return deferred.promise;
        }
    };
};
