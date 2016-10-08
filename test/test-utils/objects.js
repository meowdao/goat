import {getRandomString} from "../../server/utils/misc";
import {
	confirm,
	password,
	email,
	phoneNumber,
	country,
	countryCode
} from "../../server/utils/constants/misc";

export function makeTestEmail(type) {
	const parts = email.split("@");
	return `${parts[0]}+${type}+${getRandomString(10).toLowerCase()}@${parts[1]}`;
}

export function locationObject(...data) {
	return Object.assign({
		city: "Los Angeles",
		country,
		countryCode,
		state: "California",
		stateCode: "CA",
		streetAddress: "very long street 123",
		tag: "tag",
		zipCode: "00000",
		location: {
			type: "Point",
			coordinates: [Math.random(), Math.random()]
		}
	}, ...data);
}

export function userObject(...data) {
	return Object.assign({
		password,
		confirm,
		fullName: "Trej Gun",
		isEmailVerified: true,
		phoneNumber,
		email: makeTestEmail("user"),
		location: locationObject()
	}, ...data);
}
