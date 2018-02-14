import {Schema} from "mongoose";
import {
	domainNameMinLength,
	domainNameMaxLength,
	companyNameMinLength,
	companyNameMaxLength
} from "../../../shared/constants/misc";
import {arrayGetter} from "../../shared/utils/mongoose";
import email from "../../shared/models/plugins/email";
import language from "../../shared/models/plugins/language";
import status from "../../shared/models/plugins/status";
import phoneNumber from "../../shared/models/plugins/phoneNumber";
import type from "../../shared/models/plugins/type";


import OrganizationController from "../controllers/organization";

const Organization = new Schema({
	companyName: {
		type: String,
		required: "required",
		minlength: [companyNameMinLength, "minlength"],
		maxlength: [companyNameMaxLength, "maxlength"]
	},
	domainName: {
		type: String,
		index: {
			unique: true,
			sparse: true,
			name: "domainName-duplicate"
		},
		minlength: [domainNameMinLength, "minlength"],
		maxlength: [domainNameMaxLength, "maxlength"]
	},
	address: {
		type: String
	},
	image: {
		type: String
	},

	location: {
		_id: false,
		type: {
			type: String,
			enum: ["Point", "LineString", "Polygon"],
			default: "Point"
		},
		coordinates: {
			type: [Number],
			default: [0, 0],
			get: arrayGetter
		}
	}
}, {
	toJSON: {
		transform(doc, ret) {
			ret.created = ret.createdAt;
			ret.users = ret.users || void 0;
			delete ret.address;
			delete ret.location;
			return ret;
		}
	}
});

Organization.plugin(status, {controller: OrganizationController});
Organization.plugin(type, {controller: OrganizationController});
Organization.plugin(email);
Organization.plugin(phoneNumber);
Organization.plugin(language);

Organization.virtual("users", {
	ref: "User",
	localField: "_id",
	foreignField: "organizations"
});

Organization
	.virtual("coordinates")
	// .get(function getCoordinates() {
	// 	return this.location && this.location.coordinates;
	// })
	.set(function setCoordinates(coordinates) {
		this.location.coordinates = coordinates;
	});

Organization.index({
	location: "2dsphere"
});

export default Organization;
