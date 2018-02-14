export default function(schema, {verified = true} = {}) {
	schema.add({
		phoneNumber: {
			type: String // TODO validation
		}
	});

	if (verified) {
		schema.add({
			isPhoneNumberVerified: {
				type: Boolean,
				default: false
			}
		});
	}
}
