"use strict";

import React from "react";
import configs from "../../../../../server/configs/config.js";


const config = configs[process.env.NODE_ENV];

export default class Verification extends React.Component {
	render() {
		return (
			<div>
				<p><a href={config.server.http.url + "user/verify/" + this.props.params.hash.token}>Verify email</a></p>
			</div>
		);
	}
}

