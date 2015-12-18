"use strict";

import Q from "q";
import mongoose from "mongoose";
import debug from "debug";
import AbstractController from "./abstract/abstract.js";
import messenger from "../utils/messenger.js";
import lang from "../utils/lang.js";

import React from "react"; // eslint-disable-line no-unused-vars
import {renderToString} from "react-dom/server";
import Router, { match, RoutingContext, Route } from 'react-router'
import EML from "../../client/assets/js/components/EML.js";
import Wrapper from "../../client/assets/js/components/email/wrapper.js";
import Forgot from "../../client/assets/js/components/email/forgot.js";
import Verify from "../../client/assets/js/components/email/verify.js";
import Test from "../../client/assets/js/components/email/test.js";

import OptOutController from "../controllers/opt-out.js";

const routes = (
	<Route component={EML} path="/">
		<Route path="test" component={Test}/>
		<Route path="user" component={Wrapper}>
			<Route path="forgot" component={Forgot}/>
			<Route path="verify" component={Verify}/>
		</Route>
	</Route>
);


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
		let optOutController = new OptOutController();
		return optOutController.findOne({
			user: user._id,
			type: view
		})
			.tap(optout => messenger.notFound(optOutController, user)(!optout))
			.then(() => {
				return this.renderToString(view, data)
					.then(html => {
						this.log("template", html);
						return this.create(Object.assign({
							subject: lang.translate("email/subject/" + view, user),
							html: html
						}, address));
					});
			});
	}

	// https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
	renderToString(view, params) {
		let defered = Q.defer();
		match({routes, location: "/" + view}, (error, redirectLocation, renderProps) => {
			if (error) {
				defered.reject(error);
			} else {
				defered.resolve(renderToString(<RoutingContext {...renderProps} params={params}/>))
			}
		});
		return defered.promise;
	}

}
