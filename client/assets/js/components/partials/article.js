"use strict";

import React, {PropTypes, Component} from "react";
import Title from "../partials/title.js";
import Messages from "../partials/messages.js";
import Breadcrumbs from "../partials/breadcrumbs.js";

export default class Article extends Component {

	static displayName = "";

	static propTypes = {
		children: PropTypes.element.isRequired,
		params: PropTypes.object
	};

	constructor() {
		super(...arguments);
		this.constructor.displayName = this.props.params.displayName;
	}

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
