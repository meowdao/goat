"use strict";

import Q from "q";
import nodemailer from "nodemailer";
import messager from "../utils/messager.js";
import lang from "../utils/lang.js";
import configs from "../configs/config.js";
import React from "react";

import Router, {Route} from "react-router";
import EML from "../assets/js/components/EML.js";
import Article from "../assets/js/components/partials/article.js";
import Remind from "../assets/js/components/email/remind.js";
import Verify from "../assets/js/components/email/verify.js";
import Test from "../assets/js/components/email/test.js";


const config = configs[process.env.NODE_ENV];

let transport = nodemailer.createTransport(config.smtp);

const routes = (
	<Route name="App" handler={EML} path="/">
		<Route name="Test" path="test" handler={Test}/>
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

	sendMail (data) {
		let OptOutController = new (require("../controllers/opt_out.js"))();
		return OptOutController.findOne({
			user: data.user._id,
			type: data.view.constructor.name
		})
			.then(optout => {
				return messager.checkModel("optout")(!optout);
			})
			.then(() => {
				return renderToString(data)
					.then(html => {
						return Q.nfcall(transport.sendMail.bind(transport), {
							from: "G.O.A.T. <ctapbiumabp@gmail.com>",
							to: data.user.email,
							subject: lang.translate("email/subject/" + data.url, data.user),
							html: html
						});
					});
			});
	}

};
