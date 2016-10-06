import {Schema} from "mongoose";

const Avatar = new Schema({
	url: String
}, {
	timestamps: true,
	versionKey: false
});

export default Avatar;
