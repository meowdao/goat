import React, {Component} from "react";
import {Switch, Route} from "react-router";
import Footer from "./components/partials/footer";

import Welcome from "./components/oauth2/welcome";


import Verification from "./components/oauth2/verification";
import Forgot from "./components/oauth2/forgot";


export default class App extends Component {
	render() {
		return (
			<div>
				<Switch>
					<Route path="/welcome" component={Welcome} />
					<Route path="/verification" component={Verification} />
					<Route path="/forgot" component={Forgot} />
				</Switch>
				<Footer />
			</div>
		);
	}
}
