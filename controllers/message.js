"use strict";

var methods = {
    show: function message (request) {
        console.log("!!!", request.params.type)
        return {
            type: request.params.type
        };
    }
};

module.exports = methods;

