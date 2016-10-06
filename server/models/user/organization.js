import {Schema} from "mongoose";
import langModel from "../../lang/en/model";
import {
	goatId,
	domainNameMinLength,
	domainNameMaxLength,
	companyNameMinLength,
	companyNameMaxLength
} from "../../utils/constants/misc";
import email from "../plugins/email";
import phoneNumber from "../plugins/phoneNumber";
import lang from "../plugins/lang";
import status from "../plugins/status";


import OrganizationController from "../../controllers/user/organization";

const Organization = new Schema({
	location: {
		type: Schema.Types.ObjectId,
		ref: "Location"
	},
	payment: {
		type: Schema.Types.ObjectId,
		ref: "Payment"
	},
	organizations: [{
		type: Schema.Types.ObjectId,
		ref: "Organization"
	}],

	calendarId: String,
	companyName: {
		type: String,
		required: langModel["organization-company-name-is-required"],
		minlength: [companyNameMinLength, langModel["organization-company-name-lt-minlength"]],
		maxlength: [companyNameMaxLength, langModel["organization-company-name-gt-maxlength"]]
	},
	companyImage: {
		type: String,
		default: ""
	},
	domainName: {
		type: String,
		unique: true,
		sparse: true,
		minlength: [domainNameMinLength, langModel["organization-domain-name-lt-minlength"]],
		maxlength: [domainNameMaxLength, langModel["organization-domain-name-gt-maxlength"]]
	}
}, {
	timestamps: true,
	versionKey: false,
	toJSON: {
		virtuals: true
	}
});

Organization.plugin(status, {controller: OrganizationController});
Organization.plugin(email, {prefix: "organization", unique: false});
// Organization.plugin(phoneNumber, {prefix: "organization"});
Organization.plugin(lang);


Organization.pre("save", function preSaveEmail(next) {
	this.email = this.email || void 0;
	next();
});

Organization.index({
	email: 1,
	organizations: 1
}, {
	unique: true,
	partialFilterExpression: {email: {$exists: true}},
	name: "organization-email-duplicate"
});

Organization.pre("validate", function preValidateEmail(next) {
	if (this.organizations[0].toString() === goatId && !this.email) {
		this.invalidate("email", langModel["organization-email-is-required"], this.email);
	}
	next();
});

Organization.index({
	email: 1,
	operator: 1
}, {
	unique: true,
	partialFilterExpression: {email: {$exists: true}},
	name: "organization-email-duplicate"
});

export default Organization;
