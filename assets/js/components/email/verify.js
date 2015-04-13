"use strict";

import React from "react";

export default class Verification extends React.Component {
	render () {
		return (
			<div>
				<p><a href="http://{{this.props.serverHost}}/user/verify/{{this.props.hash}}">Verify email</a></p>
			</div>
		);
	}
}
