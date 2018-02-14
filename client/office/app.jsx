import React, {Component} from "react";
import {Switch, Route} from "react-router";
import Header from "../shared/components/partials/header";
import ErrorDialog from "../shared/components/partials/error";

import Landing from "./components/landing/landing";
import Dashboard from "./components/landing/dashboard";

import Private from "../shared/components/partials/private";
import Public from "../shared/components/partials/public";

import Login from "../shared/components/common/login";
import Message from "../shared/components/common/message";
import NotFound from "../shared/components/common/notfound";


export default class App extends Component {
	render() {
		return (
			<div>
				<Header />
				<ErrorDialog />
				<Switch>
					<Route path="/" component={Landing} exact />

					<Public path="/login" component={Login} />

					<Private path="/dashboard" component={Dashboard} />

					<Public path="/message" component={Message} />

					<Public component={NotFound} />
				</Switch>
			</div>
		);
	}
}
