"use strict";

import React, {PropTypes} from "react";
import Header from "./partials/header.js";
import Footer from "./partials/footer.js";


export default class GOAT extends React.Component {

	static propTypes = {
		params: PropTypes.object.isRequired
	};

	render() {
		console.log("GOAT:props", this.props);
		return (
			<div>
				<Header/>
				{this.props.children}
				<Footer/>
			</div>
		);
	}
}

