"use strict";

import React from "react";

export default class Remind extends React.Component {
	render () {
		return (
			<div>
				<p><a href="http://{{this.props.serverHost}}/user/change/{{this.props.hash}}">Change your password</a></p>
			</div>
		);
	}
}
