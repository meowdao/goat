import AWS from "aws-sdk";
import bluebird from "bluebird";
import {decorate} from "core-decorators";
import {promise} from "./abstract/decorators";
import AbstractAPI from "./abstract/abstract";
import configs from "../../shared/configs/config";
import {email} from "../../../shared/constants/misc";


AWS.config.setPromisesDependency(bluebird.Promise);

export default new class SES extends AbstractAPI {
	constructor() {
		super();
		const config = configs[process.env.NODE_ENV];
		AWS.config.setPromisesDependency(bluebird.Promise);
		AWS.config.update(config.ses.sesOptions);
	}

	get client() {
		return new AWS.SES({apiVersion: "2010-12-01", region: this.config.region});
	}

	@decorate(promise)
	sendEmail(mail) {
		return this.client.sendEmail({
			Source: email,
			Destination: {
				ToAddresses: mail.to
			},
			Message: {
				Body: {
					Html: {
						Data: mail.html
					}
				},
				Subject: {
					Data: mail.subject
				}
			}
		}).promise();
	}
}();
