"use strict";

import React from "react";
import {RouteHandler} from "react-router";
import Title from "../partials/title.js";
import Messages from "../partials/messages.js";
import Breadcrumbs from "../partials/breadcrumbs.js";

export default class User extends React.Component {

	static displayName = "User";

	render() {
		return (
			<div className="container">
				<Breadcrumbs {...this.props}/>
				<Title {...this.props}/>
				<Messages/>
				{this.props.children}
			</div>
		);
	}

}
