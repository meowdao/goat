"use strict";

import Q from "q";
import mongoose from "mongoose";
import debug from "debug";
import messenger from "./utils/messenger.js";
import {createHistory, createHashHistory} from "history";
import lang from "./utils/lang.js";

import React from "react"; // eslint-disable-line no-unused-vars
import {renderToString} from "react-dom/server";
import Router, { match, RoutingContext, Route } from 'react-router'
import EML from "./assets/js/components/EML.js";
import Article from "./assets/js/components/partials/article.js";
import Remind from "./assets/js/components/email/remind.js";
import Verify from "./assets/js/components/email/verify.js";
import Test from "./assets/js/components/email/test.js";

import EmailStore from "./assets/js/stores/EmailStore.js";

debug.enable("log:*");
let log = debug("log:mail");

const routes = (
	<Route component={EML} path="/">
		<Route path="test" component={Test}/>
		<Route path="user" component={Article}>
			<Route path="remind" component={Remind}/>
			<Route path="verify" component={Verify}/>
		</Route>
	</Route>
);


// https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
function myRenderToString(view, data) {
	EmailStore.setData(data);
	log("renderToString", arguments);
	let defered = Q.defer();
	match({routes, location: "/" + view}, (error, redirectLocation, renderProps) => {
		log("match", arguments);
		if (error) {
			defered.reject(error);
		} else {
			defered.resolve(renderToString(<RoutingContext {...renderProps}/>))
		}
	});
	return defered.promise;
}


myRenderToString("user/remind", {hash: {token: ":token:"}})
	.then(r => {
		log("OK");
		log(r);
	}).catch(e => {
		log("FAIL");
		log(e);
	}).done(() => {
		log("DONE");
		process.exit(0);
	});
