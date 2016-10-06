import {checkModel} from "../../utils/messenger";
import {translate} from "../../utils/lang";
import {renderEmailToString} from "../../utils/render";

import AbstractController from "../abstract/abstract";
import OptOutController from "./opt-out";


export default class MailController extends AbstractController {

	static realm = "mail";

	static statuses = {
		cancelled: "cancelled",
		delivered: "delivered",
		failed: "failded",
		new: "new",
		pending: "pending",
		queued: "queued",
		removed: "removed",
		sent: "sent",
		unrecognized: "unrecognized"
	};

	compose(view, address, user, data) {
		const optOutController = new OptOutController();
		return optOutController.findOne({
			user: user._id,
			type: view
		})
			.tap(optout => checkModel().bind(optOutController)(!optout, {user}))
			.then(() =>
				renderEmailToString(view, data)
					.then(html =>
						this.create(Object.assign({
							html,
							subject: "Subject"
						}, address))
					)
			);
	}

}
