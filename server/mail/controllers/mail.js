import {checkModel} from "../../shared/controllers/middleware";
import {renderEmailToString} from "../../shared/utils/render.email";
import {localization} from "../../../shared/intl/setup";

import AbstractController from "../../shared/controllers/abstract";
import OptOutController from "./opt-out";


export default class MailController extends AbstractController {
	static realm = "mail";

	static statuses = {
		new: "new",

		cancelled: "cancelled",
		failed: "failed",
		sent: "sent"
	};

	static types = {
		office: {
			bookingCancelledByCustomer: "bookingCancelledByCustomer",
			bookingRevokedByCustomer: "bookingRevokedByCustomer",
			newBookingForRenter: "newBookingForRenter"
		},
		oauth: {
			forgot: "forgot",
			verification: "verification",
			welcome: "welcome"
		}
	};

	compose(type, address, user, data) {
		const optOutController = new OptOutController();
		return optOutController.findOne({
			user: user._id,
			type
		})
			.tap(optout => checkModel().bind(optOutController)(!optout))
			.then(() =>
				renderEmailToString(type, data)
					.then(html =>
						this.create(Object.assign({
							html,
							type,
							subject: localization[user.language].messages[`email.types.${type}`] // try to use real object
						}, address))
					)
			);
	}
}
