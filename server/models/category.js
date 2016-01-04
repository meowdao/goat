"use strict";

import {Schema} from "mongoose";

const Category = new Schema({
	parent: {
		type: Schema.Types.ObjectId,
		ref: "Category"
	},

	title: String,
	categoryId: String,
	order: {
		type: Number,
		default: 0
	}

}, {versionKey: false});


export default Category;
