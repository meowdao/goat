import {Schema} from "mongoose";

// most of this fields are useless
const SNS = new Schema({
	Message: {
		type: Schema.Types.Mixed,
		set(message) {
			try{
				return JSON.parse(message);
			} catch (e) {
				// apparently not json but just a string
				return message;
			}
		},
		get() {
			return this.message;
		}
	},
	MessageId: String,
	Subject: String,
	Signature: String,
	SignatureVersion: String,
	SigningCertURL: String,
	SubscribeURL: String,
	Timestamp: Date,
	Token: String,
	TopicArn: String,
	Type: String,
	UnsubscribeURL: String
});

export default SNS;
