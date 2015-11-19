"use strict";

import React, {PropTypes} from "react";

class Title extends React.Component {

	static contextTypes = {
		location: PropTypes.object.isRequired
	};

	render() {

		console.log("->", this.props.route)

		let title = /*this.props.route.component.displayName ||*/ "Default Title";

		return (
			<div className="page-header">
				<h1>{title}</h1>
			</div>
		);
	}
}

export default Title;
