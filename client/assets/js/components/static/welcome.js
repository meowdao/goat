import React, {Component} from "react";
import Title from "../partials/title";


export default class Welcome extends Component {

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
