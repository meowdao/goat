import countries from "../../../../shared/intl/localization/countries.en.json";

export default function(schema) {
	schema.add({
		country: {
			type: String,
			enum: {
				values: [""].concat(Object.keys(countries)),
				message: "invalid"
			}
		}
	});
}
