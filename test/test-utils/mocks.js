import {password, confirm, fullName} from "../../server/utils/constants/misc.js";
import {getRandomString} from "../../server/utils/misc";
import {populate} from "./populate";

export function createUser(...args) {
	return this.user.create(populate(...args, (user, nested, i) =>
		Object.assign({
			password,
			confirm,
			fullName,
			email: `${getRandomString()}@gmail.com`,
			companyName: `Company_${i}`,
			domainName: `domain${i}.com`,
			phoneNumber: `1234567890${i}`
		}, user)));
}
