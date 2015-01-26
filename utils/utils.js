"use strict";

var path = require("path");

module.exports = {

    getPath: function () {
        return path.join.apply(path, [path.normalize(__dirname + "/..")].concat([].slice.call(arguments)));
    },

    isType: function (variable, type) {
        return Object.prototype.toString.call(variable) === "[object " + type + "]";
    },

    getType: function (variable) {
        return Object.prototype.toString.call(variable).match(/\s([^\]]+)/)[1];
    },

    roughSizeOfObject: function (object) {

        var objectList = [],
            stack = [object],
            bytes = 0;

        while (stack.length) {
            var value = stack.pop();
            if (typeof value === "boolean") {
                bytes += 4;
            } else if (typeof value === "string") {
                bytes += value.length * 2;
            } else if (typeof value === "number") {
                bytes += 8;
            } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
                objectList.push(value);
                for (var i in value) {
                    stack.push(value[i]);
                }
            }
        }
        return bytes;
    },

    getObject: function (parts, create, obj) {

        if (typeof parts === "string") {
            parts = parts.split(".");
        }

        if (typeof create !== "boolean") {
            obj = create;
            create = undefined;
        }

        var p;

        while (obj && parts.length) {
            p = parts.shift();
            if (obj[p] === undefined && create) {
                obj[p] = {};
            }
            obj = obj[p];
        }

        return obj;
    }
};
