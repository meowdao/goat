"use strict";

import React from "react";
import Title from "../partials/title.js";


export default class Welcome extends React.Component {

	static displayName = "Welcome";

	render() {
		return (
			<div className="container">
				<Title {...this.props}/>

				<p>Lorem ipsum!</p>
			</div>
		);
	}
}
