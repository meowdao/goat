"use strict";

import React, {PropTypes, Component} from "react";
import configs from "../../../../../server/configs/config.js";


const config = configs[process.env.NODE_ENV];

export default class Test extends Component {

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
