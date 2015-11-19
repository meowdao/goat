"use strict";

import Q from "q";
import mongoose from "mongoose";
import debug from "debug";
import AbstractController from "../utils/abstractController.js";
import messenger from "../utils/messenger.js";
import {createHistory, createHashHistory} from "history";
import lang from "../utils/lang.js";

import React from "react"; // eslint-disable-line no-unused-vars
import {renderToString} from "react-dom/server";
import Router, { match, RoutingContext, Route } from 'react-router'
import EML from "../../client/assets/js/components/EML.js";
import Article from "../../client/assets/js/components/partials/article.js";
import Remind from "../../client/assets/js/components/email/remind.js";
import Verify from "../../client/assets/js/components/email/verify.js";
import Test from "../../client/assets/js/components/email/test.js";

import EmailStore from "../../client/assets/js/stores/EmailStore.js";

import OptOutController from "../controllers/opt_out.js";

const routes = (
	<Route component={EML} path="/">
		<Route path="test" component={Test}/>
		<Route path="user" component={Article}>
			<Route path="remind" component={Remind}/>
			<Route path="verify" component={Verify}/>
		</Route>
	</Route>
);


class MailController extends AbstractController {

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
		let optOutController = new OptOutController();
		return optOutController.findOne({
			user: user._id,
			type: view
		})
			.then(optout => {
				return messenger.checkModel("optout")(!optout);
			})
			.then(() => {
				EmailStore.setData(data);
				return this.renderToString(view)
					.then(html => {
						this.log("template", html);
						return this.create(Object.assign({
							subject: lang.translate("email/subject/" + view, user),
							html: html
						}, address))
							.then(mail => {
								this.log("mail:created");
								return mail;
							});
					});
			});
	}

	// https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
	renderToString(view, data) {
		let defered = Q.defer();
		match({routes, location: "/" + view}, (error, redirectLocation, renderProps) => {
			if (error) {
				defered.reject(error);
			} else {
				defered.resolve(renderToString(<RoutingContext {...renderProps}/>))
			}
		});
		return defered.promise;
	}

}

export default MailController;
