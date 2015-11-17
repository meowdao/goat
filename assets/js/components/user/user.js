"use strict";

import React from "react";
import {RouteHandler} from "react-router";
import Title from "../partials/title.js";
import Messages from "../partials/messages.js";

export default class User extends React.Component {

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
