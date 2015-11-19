"use strict";

import React, {PropTypes} from "react";

class EML extends React.Component {
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

export default EML;
