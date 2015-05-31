"use strict";

import React, {PropTypes} from "react";
import {RouteHandler} from "react-router";

export default class EML extends React.Component {
	render() {
		return (
			<html>
			<head></head>
			<body>
			<RouteHandler {...this.props}/>
			</body>
			</html>
		);
	}
}
