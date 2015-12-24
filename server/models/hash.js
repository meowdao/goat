"use strict";

import {Schema} from "mongoose";
import utils from "../utils/utils.js";

const Hash = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	token: {
		type: String,
		default: () => utils.getRandomString(20)
	},
	created: {
		type: Date,
		default: Date.now,
		expires: 3600
	}
}, {versionKey: false});


export default Hash;
