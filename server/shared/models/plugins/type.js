import StatefulController from "../../../shared/controllers/stateful";


export default function(schema, {controller = StatefulController} = {}) {
	const types = Object.keys(controller.types);

	schema.add({
		type: {
			type: String,
			default: types[0],
			enum: {
				values: types,
				message: "invalid"
			}
		}
	});
}
