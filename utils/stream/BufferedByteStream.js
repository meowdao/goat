"use strict";

var util = require("util");
var events = require("events");
var fs = require("fs");

var BufferedByteStream = function (filename) {

    events.EventEmitter.call(this);

    var _array = [];
    var _buffer = null;
    var _offset = 0;
    var _mark = null;

    var input = fs.createReadStream(filename);

    input.on("data", function (buffer) {
        _array.push(buffer);
    });

    input.on("end", function () {
        _buffer = Buffer.concat(_array);
        _array = null;
        this.emit("ready");
    }.bind(this));

    input.on("error", function () {
        this.emit("error");
    }.bind(this));

    this.read = function (buffer, offset, length) {
        if (arguments.length === 1) {
            return this.read(buffer, 0, buffer.length);
        }

        var bytes = _buffer.copy(buffer, offset, _offset, _offset + length);
        _offset += bytes;
        return bytes;
    };

    this.skip = function (length) {
        if (_offset + length > _buffer.length) {
            _offset = _buffer.length;
            return _buffer.length - _offset;
        } else {
            _offset += length;
            return length;
        }
    };

    this.available = function () {
        return _buffer.length - _offset;
    };

    this.close = function () {
        _buffer = null;
    };

    this.mark = function () {
        _mark = _offset;
    };

    this.reset = function () {
        if (_mark !== null) {
            _offset = _mark;
        }
    };

};

util.inherits(BufferedByteStream, events.EventEmitter);

module.exports = BufferedByteStream;


