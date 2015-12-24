"use strict";

import React, {PropTypes} from "react";

export default class EML extends React.Component {

	static propTypes = {
		children: PropTypes.node
	};

	render() {
		return (
			<html>
			<head></head>
			<body>
			{this.props.children}
			</body>
			</html>
		);
	}
}
