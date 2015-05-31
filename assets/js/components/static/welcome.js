"use strict";

import React from "react";
import Title from "../partials/title.js";


export default class Welcome extends React.Component {

	render() {
		return (
			<div className="container">
				<Title />

				<p>Lorem ipsum!</p>
			</div>
		);
	}

}
