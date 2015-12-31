"use strict";

import {Schema} from "mongoose";

const Page = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},

	title: String,
	text: String,

	created: {
		type: Date,
		default: Date.now
	}
}, {versionKey: false});


export default Page;
