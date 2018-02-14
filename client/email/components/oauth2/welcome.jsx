import React, {Component} from "react";
import {companyName} from "../../../../shared/constants/misc";


export default class Welcome extends Component {
	render() {
		return (
			<div>
				<h2>Welcome to ${companyName} :)</h2>
			</div>
		);
	}
}
