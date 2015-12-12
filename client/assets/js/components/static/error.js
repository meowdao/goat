"use strict";

import React from "react";
import Title from "../partials/title.js";


export default class NotFound extends React.Component {

	static displayName = "Error";

	render() {
		return (
			<div className="container">
				<Title {...this.props}/>

				<p>Error page!</p>
			</div>
		);
	}

}

