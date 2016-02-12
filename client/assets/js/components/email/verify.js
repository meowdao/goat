"use strict";

import url from "url";
import {connect} from "react-redux";
import React, {PropTypes, Component} from "react";
import configs from "../../../../../server/configs/config";


const config = configs[process.env.NODE_ENV];

@connect(
	state => ({
		hash: state.hash
	})
)
export default class Verification extends Component {

	static propTypes = {
		hash: PropTypes.object
	};

	render() {
		return (
			<div>
				<p><a href={url.format(config.server.self) + "/user/verify/" + this.props.hash.token}>Verify email</a></p>
			</div>
		);
	}

}
