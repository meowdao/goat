import {getRandomString, getRandomFloat} from "../server/shared/utils/misc";
import populate from "./populate";
import {userObject, organizationObject, vehicleObject, bookingObject, optOutObject, postObject, settingsObject, policyObject, mailObject, clientObject, snsObject} from "./objects";

import ClientController from "../server/oauth2/controllers/client";
import UserController from "../server/oauth2/controllers/user";
import OrganizationController from "../server/oauth2/controllers/organization";
import TokenController from "../server/mail/controllers/token";
import OptOutController from "../server/mail/controllers/opt-out";
import MailController from "../server/mail/controllers/mail";
import SnsController from "../server/mail/controllers/sns";



export function createOrganization(...args) {
	const organizationController = new OrganizationController();
	return organizationController.create(populate(...args, (organization) =>
		organizationObject({
			companyName: getRandomString(getRandomFloat(5, 16), 2).toLowerCase()
		}, organization)));
}

export function createUser(...args) {
	const userController = new UserController();
	return userController.create(populate(...args, (user, nested) =>
		userObject({
			organizations: [].concat(nested.Organization)
		}, user)));
}

export function createHash(...args) {
	const tokenController = new TokenController();
	return tokenController.create(populate(...args, (booking, nested) =>
		bookingObject({
			user: nested.User,
			type: TokenController.types.email
		}, booking)));
}

export function createOptOut(...args) {
	const optOutController = new OptOutController();
	return optOutController.create(populate(...args, (optouts, nested) =>
		optOutObject({
			user: nested.User
		}, optouts)));
}

export function createMail(...args) {
	const mailController = new MailController();
	return mailController.create(populate(...args, mail =>
		mailObject({}, mail)));
}

export function createClient(...args) {
	const clientController = new ClientController();
	return clientController.create(populate(...args, client =>
		clientObject({}, client)));
}

export function createSns(...args) {
	const snsController = new SnsController();
	return snsController.create(populate(...args, client =>
		snsObject({}, client)));
}
