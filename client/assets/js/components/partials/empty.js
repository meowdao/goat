"use strict";

import React, {PropTypes, Component} from "react";
import Title from "./title.js";
import Messages from "./messages.js";
import Breadcrumbs from "./breadcrumbs.js";

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
