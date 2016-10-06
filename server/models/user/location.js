import {Schema} from "mongoose";
import {arrayGetter} from "../../utils/mongoose";

const Location = new Schema({
	tag: {
		type: String,
		default: "Main Location"
	},
	streetAddress: {
		type: String,
		default: ""
	},
	city: String,
	state: String,
	stateCode: {
		type: String,
		uppercase: true
	},
	country: String,
	countryCode: {
		type: String,
		uppercase: true
	},
	zipCode: String,
	location: {
		_id: false,
		type: {
			type: String,
			enum: ["Point", "LineString", "Polygon"],
			default: "Point"
		},
		coordinates: {
			type: [Schema.Types.Mixed],
			default: [0, 0],
			get: arrayGetter
		}
	}
}, {
	timestamps: true,
	versionKey: false
});

Location.index({
	location: "2dsphere"
});


export default Location;
