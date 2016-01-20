"use strict";

import React, {PropTypes, Component} from "react";
import Title from "./title.js";
import Messages from "./messages.js";
import Breadcrumbs from "./breadcrumbs.js";

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
