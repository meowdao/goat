import {Schema} from "mongoose";
import {getRandomString} from "../../utils/misc";
import ApiKeyController from "../../controllers/user/api-key";
import {Address4, Address6} from "ip-address";
import langModel from "../../lang/en/model";
import {arrayGetter} from "../../utils/mongoose";

const ApiKey = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	organizations: [{
		type: Schema.Types.ObjectId,
		ref: "Organization"
	}],

	publicKey: {
		type: String,
		default: () => getRandomString(64)
	},
	privateKey: {
		type: String,
		default: () => getRandomString(64),
		select: false
	},

	label: {
		type: String
	},
	permissions: {
		_id: false,
		blog: {
			type: Array,
			enum: ApiKeyController.permissions.accommodation,
			default: [],
			get: arrayGetter
		}
	},
	netMasksV4: {
		type: Array,
		validate: [{
			validator(netMasksV4) {
				return netMasksV4.every(netmask => new Address4(netmask).isValid());
			},
			msg: langModel["api-key-invalid-net-mask"]
		}],
		get: arrayGetter
	},
	netMasksV6: {
		type: Array,
		validate: [{
			validator(netMasksV6) {
				return netMasksV6.every(netmask => new Address6(netmask).isValid());
			},
			msg: langModel["api-key-invalid-net-mask"]
		}],
		get: arrayGetter
	},

	public: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true,
	versionKey: false
});

ApiKey.set("toJSON", {
	transform(doc, ret) {
		delete ret.privateKey; // eslint-disable-line no-param-reassign
		return ret;
	}
});

ApiKey
	.virtual("organization")
	.get(function getOrganization() {
		return this.organizations[0];
	});

export default ApiKey;
