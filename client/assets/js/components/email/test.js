import url from "url";
import {connect} from "react-redux";
import React, {PropTypes, Component} from "react";
import configs from "../../../../../server/configs/config";


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
