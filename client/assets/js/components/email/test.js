"use strict";

import React, {PropTypes} from "react";
import configs from "../../../../../server/configs/config.js";


const config = configs[process.env.NODE_ENV];

export default class Test extends React.Component {

	static propTypes = {
		params: PropTypes.object
	};

	render() {
		return (
			<div>
				<p>Test email {config.server.http.url} {JSON.stringify(this.props.params)}</p>
			</div>
		);
	}

}
