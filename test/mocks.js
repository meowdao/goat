"use strict";

import {password, confirm, firstName, lastName, email} from "../server/utils/constants/misc.js";
import {getRandomString} from "../server/utils/utils";
import {populate} from "./populate";

export function createUser() {
	return this.user.create(populate(...arguments, (user, nested, i) =>
			Object.assign({
				password,
				confirm,
				firstName,
				lastName,
				email: getRandomString() + "@gmail.com",
				companyName: "Company_" + i,
				domainName: "domain.com" + i,
				phoneNumber: "1234567890" + i
			}, user)))
		.then(users => {
			// log("users", users);
			return users;
		});
}