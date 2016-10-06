import {Schema} from "mongoose";
import {arrayGetter} from "../../utils/mongoose";

const Client = new Schema({
	clientId: {type: String},
	clientSecret: {type: String},
	redirectURIs: {
		type: Array,
		get: arrayGetter
	}
}, {
	timestamps: true,
	versionKey: false
});

export default Client;
