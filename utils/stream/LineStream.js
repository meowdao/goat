"use strict";

var util = require("util");
var events = require("events");

var LineStream = function (input) {

    events.EventEmitter.call(this);

    var remaining = "";

    input.on("data", function (data) {
        remaining += data;
        var index = remaining.indexOf("\n");
        var last = 0;
        while (index > -1) {
            var line = remaining.substring(last, index);
            last = index + 1;
            this.emit("data", line);
            index = remaining.indexOf("\n", last);
        }
        remaining = remaining.substring(last);
    }.bind(this));

    input.on("end", function() {
        if (remaining.length > 0) {
            this.emit("data", remaining);
        }
        this.emit("end", input.path);
    }.bind(this));
};

util.inherits(LineStream, events.EventEmitter);

module.exports = LineStream;


