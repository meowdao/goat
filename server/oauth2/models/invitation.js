import {Schema} from "mongoose";
import email from "../../shared/models/plugins/email";
import status from "../../shared/models/plugins/status";

const Invitation = new Schema({

});

Invitation.plugin(email);
Invitation.plugin(status);

Invitation.index({
	organizations: 1,
	email: 1
}, {unique: true});

export default Invitation;
