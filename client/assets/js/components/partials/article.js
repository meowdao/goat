"use strict";

import React, {PropTypes, Component} from "react";
import Title from "./title";
import Messages from "./messages";
import Breadcrumbs from "./breadcrumbs";

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
