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

