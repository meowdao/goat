"use strict";

import _ from "lodash";

import AbstractController from "./abstract/abstract.js";

export default class OptOutController extends AbstractController {

	change(request) {
		return this.remove({user: request.user._id})
			.then(() => {
				return this.create(_.map(request.body.types, type => {
					return {
						type: type,
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
