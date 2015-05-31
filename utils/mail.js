"use strict";

import Q from "q";
import nodemailer from "nodemailer";
import messager from "../utils/messager.js";
import configs from "../configs/config.js";
import React from "react";

import Router from "react-router";
import Article from "../assets/js/components/partials/article.js";
import Remind from "../assets/js/components/email/remind.js";
import Verify from "../assets/js/components/email/verify.js";


var config = configs[process.env.NODE_ENV],
	transport = nodemailer.createTransport(config.smtp);

const routes = (
	<Route name="App" handler={GOAT} path="/">
		<Route name="User" path="user" handler={Article}>
			<Route name="Remind" path="remind" handler={Remind}/>
			<Route name="Verify" path="verify" handler={Verify}/>
		</Route>
	</Route>
);

function renderToString(data) {
	let deferred = Q.defer();
	Router.run(routes, data.url, function (Handler) {
		deferred.resolve(React.renderToString(<Handler  {...data}/>));
	});
	return deferred.promise;
}

export default {

	sendMail (request, data) {
		let OptOutController = new (require("../controllers/opt_out.js"))();
		return OptOutController.findOne({
			user: request.user._id,
			type: data.view.constructor.name
		})
			.then(optout => {
				messager.checkModel("optout")(!optout);
			})
			.then(() => {
				return renderToString(data)
					.then(html => {
						return Q.nfcall(transport.sendMail.bind(transport), {
							from: "G.O.A.T. <ctapbiumabp@gmail.com>",
							to: request.user.email,
							subject: data.subject,
							html: html
						});
					});
			});
	}

};
