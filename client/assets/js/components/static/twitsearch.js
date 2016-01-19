"use strict";

import React from "react";
import Title from "../partials/title.js";
import TwitterList from "../partials/twitterlist.js";
import TwitterForm from "../partials/twitterform.js";

export default class TwitSearch extends React.Component {

	static displayName = "Twitter Search";

	render() {
		return (
			<div className="container">
				<TwitterForm query="Search" count="5"/>
				<TwitterList />
			</div>
		);
	}
}
