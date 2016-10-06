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

}, {
	timestamps: true,
	versionKey: false
});


export default Category;
