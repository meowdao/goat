"use strict";

import {Schema} from "mongoose";
import utils from "../utils/utils.js";

var Hash = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	token: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now,
		expires: 3600
	}
}, {versionKey: false});

Hash.pre("save", function (next) {
	if (this.isNew) {
		this.token = utils.getRandomString(20);
	}
	next();
});

Hash.index({
	user: 1,
	type: 1
}, {unique: true});

export default Hash;
