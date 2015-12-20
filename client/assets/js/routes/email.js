"use strict";

import React from "react"; // eslint-disable-line no-unused-vars

import EML from "../components/EML.js";
import Wrapper from "../components/email/wrapper.js";
import Forgot from "../components/email/forgot.js";
import Verify from "../components/email/verify.js";
import Test from "../components/email/test.js";

import Router, { match, RoutingContext, Route } from 'react-router';
import {renderToString} from "react-dom/server";

export default (
	<Route path="/" component={EML}>
		<Route path="test" component={Test}/>
		<Route path="user" component={Wrapper}>
			<Route path="forgot" component={Forgot}/>
			<Route path="verify" component={Verify}/>
		</Route>
	</Route>
);
