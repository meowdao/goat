"use strict";

import {Schema} from "mongoose";

var Avatar = new Schema({
	url: String
}, {versionKey: false});

export default Avatar;
