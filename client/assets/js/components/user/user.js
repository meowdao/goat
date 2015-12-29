"use strict";

import React, {PropTypes} from "react";
import Title from "../partials/title.js";
import Messages from "../partials/messages.js";
import Breadcrumbs from "../partials/breadcrumbs.js";

export default class User extends React.Component {

	static displayName = "User";

	static propTypes = {
		children: PropTypes.element.isRequired
	};

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
