"use strict";

import React from "react";


export default class Wrapper extends React.Component {

	render() {
		return (
			<div className="container">
				{this.props.children}
			</div>
		);
	}

}

