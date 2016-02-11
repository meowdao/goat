"use strict";

import url from "url";
import React, {PropTypes, Component} from "react";
import configs from "../../../../../server/configs/config";
import {connect} from "react-redux";

const config = configs[process.env.NODE_ENV];


@connect(
	state => ({
		user: state.user
	})
)
export default class Test extends Component {

	static propTypes = {
		user: PropTypes.object
	};

	render() {
		return (
			<div>
				<p>Test email {url.format(config.server.self)} {this.props.user.email}</p>
			</div>
		);
	}

}
