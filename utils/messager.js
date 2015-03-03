"use strict";

module.exports = {
    messages: {
        "page-not-found": {
            message: "Page Not Found",
            status: 404
        },
        "user-not-found": {
            message: "User Not Found",
            status: 404
        },
        "server-error": {
            message: "Internal Server Error",
            status: 500
        },
        "expired-key": {
            message: "Link is expired.",
            status: 200
        },
        "no-param": {
            message: "Required parameter not found",
            status: 400
        },
        "access-denied": {
            message: "Access denied",
            status: 403
        },
        "optout": {
            message: "User is opted out from this type of email",
            status: 0
        }
    },
    makeError: function (key) {
        var error = new Error();
        error.message = this.messages[key].message;
        error.status = this.messages[key].status;
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

