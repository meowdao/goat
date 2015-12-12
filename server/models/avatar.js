"use strict";

import {Schema} from "mongoose";

let Avatar = new Schema({
	url: String
}, {versionKey: false});

export default Avatar;
