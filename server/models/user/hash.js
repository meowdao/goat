"use strict";

import {Schema} from "mongoose";
import {getRandomString} from "../../utils/utils";

const Hash = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	type: String,
	token: {
		type: String,
		default: () => getRandomString(20)
	},
	created: {
		type: Date,
		default: Date.now,
		expires: 3600
	}
}, {versionKey: false});


export default Hash;
