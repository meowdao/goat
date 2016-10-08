import {getRandomString} from "../../server/utils/misc";
import {populate} from "./populate";
import {userObject} from "../test-utils/objects";

import UserController from "../../server/controllers/user/user";


export function createUser(...args) {
	const userController = new UserController(false);
	return userController.create(populate(...args, (user, nested, i) =>
		userObject({
			role: "admin",
			domainName: `${getRandomString().toLowerCase()}.goat.com`,
		}, user)));
}
