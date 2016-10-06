export default function (schema, {controller}) {
	const statuses = Object.keys(controller.statuses);

	schema.add({
		status: {
			type: String,
			enum: statuses.map(key => statuses[key]),
			default: statuses[0]
		}
	});
}
