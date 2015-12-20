"use strict";

import React, {PropTypes} from "react";

export default class Title extends React.Component {

	render() {

		let title = this.props.routes[this.props.routes.length - 1].component.displayName || "Default Title";

		return (
			<div className="page-header">
				<h1>{title}</h1>
			</div>
		);
	}

}

