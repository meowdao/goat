"use strict";

import React, {PropTypes} from "react";
import Header from "./partials/header.js";
import Footer from "./partials/footer.js";


export default class GOAT extends React.Component {

	static displayName = "GOAT";

	static propTypes = {
		children: PropTypes.node,
		params: PropTypes.object.isRequired
	};

	render() {
		return (
			<div>
				<Header {...this.props}/>
				{this.props.children}
				<Footer/>
			</div>
		);
	}
}
