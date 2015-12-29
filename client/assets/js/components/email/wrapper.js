"use strict";

import React, {PropTypes} from "react";


export default class Wrapper extends React.Component {

	static propTypes = {
		children: PropTypes.element.isRequired
	};

	render() {
		return (
			<div className="container">
				{this.props.children}
			</div>
		);
	}

}
