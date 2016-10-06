import React from "react";
import TwitterList from "./twitterlist";
import TwitterForm from "./twitterform";


export default class TwitSearch extends React.Component {

	static displayName = "Twitter Search";

	render() {
		return (
			<div>
				<TwitterForm />
				<TwitterList />
			</div>
		);
	}
}
