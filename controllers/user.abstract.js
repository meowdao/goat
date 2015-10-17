"use strict";

import Q from "q";
import _ from "lodash";
import mongoose from "mongoose";
import passport from "passport";

import mail from "../utils/mail.js";
import messager from "../utils/messager.js";
import AbstractController from "../utils/controller.js";

import Remind from "../assets/js/components/email/remind.js";
import Verify from "../assets/js/components/email/verify.js";

export default class AbstractUserController extends AbstractController {

	constructor() {
		super(mongoose.model("User"), {
			populate: "avatar" // entity
		});
	}

	login(request, response) {
		var defer = Q.defer();

		passport.authenticate("local", {badRequestMessage: "missing-credentials"}, function (error, user, info) {
			defer.makeNodeResolver()(error || info, user);
		})(request, response);

		return defer.promise;
	}

	register(request) {
		return this.create(request.body)
			.then(user => {
				return Q.nbind(request.login, request)(user)
					.then(() => {
						return this.sendEmailVerification(request);
					});
			});
	}

	forgot(request) {
		var clean = _.pick(request.body, ["email"]);
		return this.findOne(clean)
			.then(messager.checkModel("user-not-found"))
			.then(user => {
				let hashController = new (require("../controllers/hash.js"))();
				return hashController.create({user: user._id})
					.then(hash => {
						return mail.sendMail({
							view: "/user/remind",
							user: user,
							hash: hash
						});
					});
			})
			.thenResolve({
				messages: ["Email was sent"]
			});
	}

	change(request) {
		let hashController = new (require("../controllers/hash.js"))();
		return hashController.findByIdAndRemove(request.params.hash)
			.then(messager.checkModel("expired-key"))
			.then(hash => {
				return this.findById(hash.user, {lean: false})
					.then(user => {
						user.password = request.body.password;
						user.confirm = request.body.confirm;
						return this.save(user);
					});
			})
			.thenResolve({
				messages: ["Now you can login with your new password"]
			});
	}

	sendEmailVerification(request) {
		let hashController = new (require("../controllers/hash.js"))();
		return hashController.create({user: request.user._id})
			.then(hash => {
				return mail.sendMail({
					view: "/user/verify",
					hash: hash,
					user: request.user
				});
			})
			.thenResolve({
				messages: ["Verification email was sent to " + request.user.email]
			});
	}

	verify(request) {
		let hashController = new (require("../controllers/hash.js"))();
		return hashController.findByIdAndRemove(request.params.hash)
			.then(hash => {
				return this.findById(hash.user, {lean: false})
					.then(user => {
						user.email_verified = true;
						return this.save(user);
					});
			})
			.thenResolve({
				messages: ["Email is verified"]
			});
	}

	logout(request, response) {
		request.logout();
		request.session.logout = true;
		response.clearCookie();
		response.redirect("user/login");
	}
}

