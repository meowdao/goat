import {Schema} from "mongoose";
import {getRandomString} from "../../shared/utils/misc";


const AuthorizationCode = new Schema({
	code: {
		type: String,
		default: () => getRandomString(16, 3)
	},
	clientId: String,
	redirectURI: String,
	userId: String
}, {
	timestamps: true,
	versionKey: false
});

export default AuthorizationCode;
