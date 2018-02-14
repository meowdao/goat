import {Schema} from "mongoose";
import status from "../../shared/models/plugins/status";
import {arrayGetter} from "../../shared/utils/mongoose";
import MailController from "../controllers/mail";


const Mail = new Schema({
	to: {
		type: [String],
		get: arrayGetter
	},
	cc: {
		type: [String],
		get: arrayGetter
	},
	bcc: {
		type: [String],
		get: arrayGetter
	},
	type: String, // for tests
	subject: String,
	html: String
});

Mail.plugin(status, {controller: MailController});

export default Mail;
