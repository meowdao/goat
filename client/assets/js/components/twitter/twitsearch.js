"use strict";

import React from "react";
import TwitterList from "./twitterlist.js";
import TwitterForm from "./twitterform.js";

export default class TwitSearch extends React.Component {

	static displayName = "Twitter Search";

	render() {
		return (
			<div className="container">
				<TwitterForm />
				<TwitterList />
			</div>
		);
	}
}
