import {Schema} from "mongoose";
import {getRandomString} from "../../shared/utils/misc";


const AccessToken = new Schema({
	accessToken: {
		type: String,
		default: () => getRandomString(256, 3)
	},
	accessTokenExpiresOn: Date,
	clientId: String,
	refreshToken: String,
	refreshTokenExpiresOn: Date,
	userId: String // TODO use ObjectId
}, {
	timestamps: true,
	versionKey: false
});

/*
// TODO use index
AccessToken.index({
	updatedAt: 1
}, {
	expireAfterSeconds: 3600
});
 */

export default AccessToken;
