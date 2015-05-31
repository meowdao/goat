"use strict";

import React, {PropTypes} from "react";

import Empty from "./static/empty.js";
import Verification from "./email/verification.js";

const routes = {
	empty: Empty,
	verification: Verification
};

export default class EML extends React.Component {

	static propTypes = {
		view: PropTypes.string
	};

	static defaultProps = {
		view: "empty"
	};

	constructor(props) {
		super(props);
	}

	render() {
		const view = routes[this.props.view];
		return (
			<html>
			<head></head>
			<body>
			<view {...this.props}/>
			</body>
			</html>
		);
	}
}
