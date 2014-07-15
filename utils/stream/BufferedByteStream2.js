"use strict";

var util = require("util");
var events = require("events");
var fs = require("fs");

var BufferedByteStream = function (filename) {

    events.EventEmitter.call(this);

    var _array = [];
    var _buffer = null;
    var _double = new Buffer(8);
    var _int = new Buffer(4);

    var input = fs.createReadStream(filename);

    input.on("data", function (buffer) {
        _array.push(buffer);
    });

    input.on("end", function () {
        _buffer = Buffer.concat(_array);
        _array = null;
        this.emit("ready");
    }.bind(this));

    input.on("error", function (error) {
        this.emit("error", error);
    }.bind(this));

    this.getDouble = function (offset) {
        this.read(_double, offset, _double.length);
        return _double.readDoubleLE(0);
    };

    this.getInt = function (offset) {
        this.read(_int, offset, _int.length);
        return _int.readInt32LE(0);
    };

    this.read = function (buffer, offset, length) {
        return _buffer.copy(buffer, 0, offset, offset + length); // faster than split
    };
};

util.inherits(BufferedByteStream, events.EventEmitter);

module.exports = BufferedByteStream;


