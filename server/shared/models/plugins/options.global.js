import {clearJSON} from "../../utils/response";


export default function(schema) {
	schema.set("timestamps", true);

	const transform = (schema.get("toJSON") || {transform: (doc, ret) => ret}).transform;
	schema.set("toJSON", {
		virtuals: true,
		transform(doc, ret) {
			return clearJSON(transform(doc, ret));
		}
	});
}
