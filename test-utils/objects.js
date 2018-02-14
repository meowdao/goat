import {getRandomFloat, getRandomString} from "../server/shared/utils/misc";
import {
	companyName,
	confirm,
	country,
	domainName,
	email,
	fullName,
	password,
	phoneNumber,
	systemId
} from "../shared/constants/test";
import {date} from "../shared/constants/date";
import {defaultLanguage as language} from "../shared/constants/language";
import {localization} from "../shared/intl/setup";


export function makeTestEmail(type) {
	const parts = email.split("@");
	return `${parts[0]}+${type}+${getRandomString(10).toLowerCase()}@${parts[1]}`;
}

export function makeTestDomainName() {
	return `${getRandomString(10)}.${domainName}`;
}


export function organizationObject(...data) {
	return Object.assign({
		companyName,
		domainName: makeTestDomainName(),
		phoneNumber,
		organizations: [systemId],
		email: makeTestEmail("organization"),
		delivery: true,
		address: "very long street 123",
		coordinates: [getRandomFloat(-180, 180, 5), getRandomFloat(-90, 90, 5)]
	}, ...data);
}

export function userObject(...data) {
	return Object.assign({
		password,
		confirm,
		fullName,
		phoneNumber,
		language,
		country,
		isEmailVerified: true,
		email: makeTestEmail("user")
	}, ...data);
}

export function optOutObject(...data) {
	return Object.assign({
		type: "welcome"
	}, ...data);
}

export function mailObject(...data) {
	return Object.assign({
		to: email,
		cc: email,
		bcc: email,
		type: "welcome",
		subject: localization[language].messages["email.types.welcome"],
		html: "Welcome my friend :)"
	}, ...data);
}

export function clientObject(...data) {
	return Object.assign({
		clientId: "goat-test-server",
		clientSecret: "01123581321345589144233377610",
		redirectURIs: [
			"http://localhost:9001/api/auth/system/callback",
			"http://localhost:8001/api/auth/system/callback",
			"http://localhost:7001/api/auth/system/callback"
		]
	}, ...data);
}

export function snsObject(...data) {
	return Object.assign({
		Type: "type",
		MessageId: "id",
		TopicArn: "arn",
		Subject: "suject",
		Message: {
			Text: "text"
		},
		Timestamp: date
	}, ...data);
}
