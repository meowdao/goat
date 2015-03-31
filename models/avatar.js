"use strict";

import {Schema} from "mongoose";

var Avatar = new Schema({
    url: String
}, { collection: "test_avatar", versionKey: false });

module.exports = Avatar;
