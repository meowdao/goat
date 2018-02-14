import {Schema} from "mongoose";
import StatefulController from "../../../shared/controllers/stateful";


export default function(schema, {controller = StatefulController} = {}) {
	const statuses = Object.keys(controller.statuses);

	schema.add({
		organizations: [{
			type: Schema.Types.ObjectId,
			ref: "Organization"
		}]
	});

	schema.add({
		status: {
			type: String,
			default: statuses[0],
			enum: {
				values: statuses,
				message: "invalid"
			}
		}
	});

	schema
		.virtual("organization")
		.get(function getOrganization() {
			// organizations may be excluded by `select` clause
			return this.organizations && this.organizations[0];
		})
		.set(function setOrganization(organization) {
			this.organizations.set(0, organization);
		});
}
