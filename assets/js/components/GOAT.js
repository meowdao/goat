"use strict";

import React, {PropTypes} from "react";
import Header from "./partials/header.js";
import Footer from "./partials/footer.js";
import {RouteHandler} from "react-router";


export default class GOAT extends React.Component {

	static propTypes = {
		params: PropTypes.object.isRequired,
		query: PropTypes.object.isRequired
	};

	render() {
		return (
			<div>
				<Header/>
				<RouteHandler {...this.props}/>
				<Footer/>
			</div>
		);
	}
}
