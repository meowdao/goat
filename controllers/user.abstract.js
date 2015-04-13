"use strict";

import Q from "q";
import _ from "lodash";
import mongoose from "mongoose";
import passport from "passport";

import mail from "../utils/mail.js";
import messager from "../utils/messager.js";
import AbstractController from "../utils/controller.js";
import HashController from "./hash.js";

import Remind from "../assets/js/components/email/remind.js";
import Verify from "../assets/js/components/email/verify.js";

export default class AbstractUserController extends AbstractController {

	hashController = new HashController();

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

	signUp(request) {
		return this.create(request.body)
			.then((user) => {
				return Q.nbind(request.logIn, request)(user)
					.then(() => {
						return this.sendEmailVerification(request);
					});
			});
	}

	forgot(request) {
		var clean = _.pick(request.body, ["email"]);
		return this.findOne(clean)
			.then(messager.checkModel("user-not-found"))
			.then((user) => {
				return this.hashController.create({user: user._id})
					.then((hash) => {
						return mail.sendMail({user: user}, {
							subject: "G.O.A.T Password Reset Instructions",
							view: Remind,
							hash: hash
						});
					})
					.thenResolve({
						messages: ["Email was sent"]
					});
			});
	}

	change(request) {
		return this.hashController.getByIdAndDate(request.params.hash)
			.then((hash) => {
				return this.findById(hash.user, {lean: false})
					.then((user) => {
						user.password = request.body.password;
						user.confirm = request.body.confirm;
						return this.save(user)
							.then(() => {
								return this.hashController.findByIdAndRemove(request.params.hash)
									.thenResolve({
										messages: ["Now you can login with your new password"]
									});
							});
					});
			});
	}

	sendEmailVerification(request) {
		return this.hashController.create({user: request.user._id})
			.then((hash) => {
				return mail.sendMail(request, {
					subject: "G.O.A.T Email Verification",
					view: Verify,
					hash: hash
				})
					.thenResolve({
						messages: ["Verification email was sent to " + request.user.email]
					});
			});
	}

	verify(request) {
		return this.hashController.getByIdAndDate(request.params.hash)
			.then((hash) => {
				return this.findById(hash.user, {lean: false})
					.then((user) => {
						user.email_verified = true;
						return this.save(user)
							.then(() => {
								return this.hashController.findByIdAndRemove(request.params.hash)
									.thenResolve({
										messages: ["Email is verified"]
									});
							});
					});
			});
	}

	logout(request, response) {
		request.logout();
		request.session.logout = true;
		response.clearCookie();
		response.redirect("user/login");
	}
}

