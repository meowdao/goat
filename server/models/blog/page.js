import {Schema} from "mongoose";

const Page = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},

	title: String,
	text: String
}, {
	timestamps: true,
	versionKey: false
});


export default Page;
