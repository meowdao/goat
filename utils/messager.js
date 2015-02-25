"use strict";

module.exports = {
    messages: {
        "page-not-found": {
            message: "Page Not Found",
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
    makeError: function (key, stop) {
        var error = new Error();
        for (var i in this.messages[key]) {
            error[i] = this.messages[key][i];
        }
        if (!stop) {
            throw error;
        } else {
            return error;
        }
    }
};

