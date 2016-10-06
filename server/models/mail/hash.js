import {Schema} from "mongoose";
import {getRandomString} from "../../utils/misc";


const Hash = new Schema({
	user: {
		type: Schema.Types.ObjectId
	},
	token: {
		type: String,
		default: () => getRandomString(20)
	},
	type: {
		type: String
	}
}, {
	timestamps: true,
	versionKey: false
});

Hash.index({
	user: 1,
	type: 1
}, {unique: true});

Hash.index({
	updatedAt: 1
}, {
	expireAfterSeconds: 3600
});

export default Hash;
