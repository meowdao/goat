"use strict";

import React from "react";
import {RouteHandler} from "react-router";
import Title from "./title.js";
import Messages from "./messages.js";
//import Breadcrumbs from "./breadcrumbs.js";
import AdminStore from "../../stores/AdminStore.js";


export default class Article extends React.Component {

	static willTransitionTo(transition) {
		// This method is called before transitioning to this component. If the user is not logged in, we’ll send him or her to the Login page.
		if (!AdminStore.isLoggedIn()) {
			transition.redirect("/");
		}
	}

	render() {
		return (
			<div className="container">
				<Title {...this.props}/>
				<Messages/>
				{this.props.children}
			</div>
		);
	}

}

