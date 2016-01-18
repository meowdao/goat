"use strict";

import React, {PropTypes, Component} from "react";


export default class Wrapper extends Component {

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
