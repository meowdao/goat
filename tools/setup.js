import q from "q";
import "../server/configs/winston";
import winston from "winston";
import {email} from "../server/utils/constants/misc";
import {userObject} from "../server/utils/constants/objects";
import {cleanUp} from "../test/test-utils/flow";

import ClientController from "../server/controllers/user/client";
import UserController from "../server/controllers/user/user";


const clientController = new ClientController();
const userController = new UserController();

cleanUp()
	.then(() =>
		q.all([
			userController.create(userObject({email, location: null, isEmailVerified: true, status: "active"})),
			clientController.create({
				clientId: "goat-test-server",
				clientSecret: "01123581321345589144233377610",
				redirectURIs: [
					"http://localhost:9000/api/auth/goat/callback"
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
