"use strict";

import React, {PropTypes, Component} from "react";
import Title from "./title";
import Messages from "./messages";
import Breadcrumbs from "./breadcrumbs";

export default class Empty extends Component {

	static displayName = "Components";

	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}

}
