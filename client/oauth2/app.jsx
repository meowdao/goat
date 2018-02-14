import React, {Component} from "react";
import Header from "../shared/components/partials/header";
import ErrorDialog from "../shared/components/partials/error";
import AlertContainer from "./components/partials/alert";
import {Switch} from "react-router";

import Private from "../shared/components/partials/private";
import Public from "../shared/components/partials/public";

import Message from "../shared/components/common/message";
import NotFound from "../shared/components/common/notfound";

import Authorize from "./components/user/authorize";
import Change from "./components/user/change";
import Email from "./components/user/email";
import Forgot from "./components/user/forgot";
import Login from "./components/user/login";
import Password from "./components/user/password";
import Register from "./components/user/register";
import Verification from "./components/user/verification";
import Resend from "./components/user/resend";


export default class App extends Component {
	render() {
		return (
			<div>
				<Header />
				<ErrorDialog />
				<AlertContainer />
				<Switch>
					<Public path="/authorize" component={Authorize} />
					<Public path="/change/:token" component={Change} />
					<Public path="/forgot" component={Forgot} />
					<Public path="/login" component={Login} />
					<Public path="/message" component={Message} />
					<Public path="/register" component={Register} />
					<Public path="/verify/:token" component={Verification} />
					<Public path="/resend" component={Resend} />

					<Private path="/email" component={Email} />
					<Private path="/password" component={Password} />

					<Public component={NotFound} />
				</Switch>
			</div>
		);
	}
}
