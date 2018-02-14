import bluebird from "bluebird";
import {times} from "lodash";
import winston from "winston";
import "../server/shared/configs/winston";
import {systemId} from "../shared/constants/misc";
import {processValidationError} from "../server/shared/utils/error";
import {userObject, organizationObject} from "../test-utils/objects";
import {cleanUp} from "../test-utils/flow";
import {getServerUrl} from "../shared/utils/misc";

import ClientController from "../server/oauth2/controllers/client";
import OrganizationController from "../server/oauth2/controllers/organization";
import UserController from "../server/oauth2/controllers/user";
import MailController from "../server/mail/controllers/mail";


const email = "trejgun@gmail.com";

const clientController = new ClientController();
const organizationController = new OrganizationController();
const userController = new UserController();
const mailController = new MailController();

cleanUp()
	.then(() =>
		bluebird.all([
			organizationController.create(organizationObject({
				_id: systemId,
				email
			})),
			clientController.create({
				clientId: `goat-${process.env.NODE_ENV}-server`,
				clientSecret: "01123581321345589144233377610",
				redirectURIs: [
					`${getServerUrl("office")}/api/auth/system/callback`
				]
			}),
			mailController.create({
				to: [email],
				subject: "Test Email",
				html: "<h2>Lorem ipsum sit amet</h2>"
			})
		])
			.spread(organization =>
				bluebird.all([
					userController.create(userObject({
						_id: systemId,
						organizations: [organization],
						email,
						social: {
							facebook: "369446300063594",
							google: "113789811157156505051"
						}
					})),
					userController.create(userObject({
						organizations: [organization],
						fullName: "CTAPbIu MABP",
						email: "ctapbiumabp@gmail.com",
						social: {
							facebook: "1364552366951980"
						}
					}))
				])
			)
	)
	.then(() => {
		winston.info("OK");
	})
	.catch(e => {
		winston.info("FAIL");
		if (e.name === "ValidationError") {
			winston.info(processValidationError(e));
		} else {
			winston.info(e);
		}
	})
	.done(() => {
		winston.info("DONE");
		process.exit(0);
	});
