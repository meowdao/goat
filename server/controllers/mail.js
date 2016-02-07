"use strict";

import {checkModel} from "../utils/messenger.js";
import {translate} from "../utils/lang.js";
import {renderEmailToString} from "../utils/render";

import AbstractController from "./abstract/abstract.js";
import OptOutController from "./opt-out.js";


export default class MailController extends AbstractController {

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

	composeMail(view, address, user, data) {
		const optOutController = new OptOutController();
		return optOutController.findOne({
			user: user._id,
			type: view
		})
		.tap(optout => checkModel(optOutController, user)(!optout))
		.then(() => {
			return renderEmailToString(view, data)
			.then(html => {
				this.log("template", html);
				return this.create(Object.assign({
					html,
					subject: translate("email/subject/" + view, user)
				}, address));
			});
		});
	}

}
