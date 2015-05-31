"use strict";

import React, {PropTypes} from "react";

export default class Title extends React.Component {

	static contextTypes = {
		router: PropTypes.func.isRequired
	};

	render() {

		let routes = this.context.router.getCurrentRoutes(),
			route = routes[routes.length - 1],
			title = route.handler.displayName || route.name || "Default Title";

		return (
			<div className="page-header">
				<h1>{title}</h1>
			</div>
		);
	}
}

