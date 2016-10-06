import q from "q";
import "../server/configs/winston";
import winston from "winston";
import {email, goatId} from "../server/utils/constants/misc";
import {organizationObject, userObject} from "../server/utils/constants/objects";
import {cleanUp} from "../test/test-utils/flow";

import OrganizationController from "../server/controllers/user/organization";
import ApiKeyController from "../server/controllers/user/api-key";
import ClientController from "../server/controllers/user/client";
import UserController from "../server/controllers/user/user";


const apiKeyController = new ApiKeyController();
const clientController = new ClientController();
const organizationController = new OrganizationController();
const userController = new UserController();

cleanUp()
	.then(() =>
		q.all([
			q.all([
				userController.create(userObject({email, location: null, isEmailVerified: true, status: "active"})),
				organizationController.create([organizationObject({_id: goatId, email, location: null, organizations: [goatId]})])
			])
				.spread((user, organizations) =>
					apiKeyController.create({
						user,
						organizations,
						permissions: {
							blog: ApiKeyController.permissions.blog
						}
					})
				),
			clientController.create({
				clientId: "goat-test-server",
				clientSecret: "01123581321345589144233377610",
				redirectURIs: [
					"http://localhost:9000/auth/goat/callback"
				]
			})
		])
	)
	.then(() => {
		winston.info("OK");
	})
	.catch(e => {
		winston.info("FAIL");
		winston.info(e.message);
	})
	.done(() => {
		winston.info("DONE");
		process.exit(0);
	});
