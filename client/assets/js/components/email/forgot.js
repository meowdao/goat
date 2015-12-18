"use strict";

import React from "react";
import configs from "../../../../../server/configs/config.js";


const config = configs[process.env.NODE_ENV];

export default class Forgot extends React.Component {
	render() {
		return (
			<div>
				<p><a href={config.server.http.url + "/user/change/" + this.props.params.hash.token}>Change your password</a></p>
			</div>
		);
	}
}

