"use strict";

import {Schema} from "mongoose";

const Avatar = new Schema({
	url: String
}, {versionKey: false});

export default Avatar;
