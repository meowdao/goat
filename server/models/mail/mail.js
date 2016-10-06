import {Schema} from "mongoose";
import MailController from "../../controllers/mail/mail";

const statuses = MailController.statuses;

const Mail = new Schema({
	to: [String],
	cc: [String],
	bcc: [String],
	subject: String,
	html: String,

	status: {
		type: String,
		enum: Object.keys(statuses).map(key => statuses[key]),
		default: statuses.new
	}
}, {
	timestamps: true,
	versionKey: false
});

export default Mail;
