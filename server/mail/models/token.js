import {Schema} from "mongoose";
import {getRandomString} from "../../shared/utils/misc";


const Token = new Schema({
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
});

Token.index({
	user: 1,
	type: 1
}, {unique: true});

Token.index({
	updatedAt: 1
}, {
	expireAfterSeconds: 3600
});

export default Token;
