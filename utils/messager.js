"use strict";

import lang from "./lang.js";

var statuses = {
    "expired-key": 200,
    "no-param": 400,
    "no-origin": 403,
    "access-denied": 403,
    "page-not-found": 404,
    "user-not-found": 404,
    "server-error": 500
};

export default {
    makeError: function (key, user) {
        var error = new Error();
        error.message = lang.translate("error/server/" + key, user);
        error.status = statuses[key] || 500;
        return error;
    },
    checkModel: function (key, user) {
        return function (model) {
            if (!model) {
                throw module.exports.makeError(key, user);
            } else {
                return model;
            }
        };
    }
};

