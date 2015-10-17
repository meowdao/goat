"use strict";

import {Schema} from "mongoose";

var Hash = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	created: {
		type: Date,
		default: Date.now,
		expires: 3600
	}
}, {versionKey: false});

export default Hash;
