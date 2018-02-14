import {Schema} from "mongoose";
import MailController from "../controllers/mail";


const OptOut = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	type: {
		type: String,
		enum: {
			values: [].concat(...Object.keys(MailController.types).map(type => Object.keys(MailController.types[type]))),
			message: "invalid"
		}
	}
});

export default OptOut;
