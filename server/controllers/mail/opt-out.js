import _ from "lodash";

import AbstractController from "../abstract/abstract";

export default class OptOutController extends AbstractController {

	static realm = "mail";

	change(request) {
		return this.remove({user: request.user._id})
			.then(() => {
				return this.create(_.map(request.body.types, type => {
					return {
						type,
						user: request.user
					};
				}));
			})
			.then(() => {
				return {
					redirect: "/optout/notifications",
					message: "Saved!"
				};
			});
	}

}
