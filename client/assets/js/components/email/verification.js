import {connect} from "react-redux";
import React, {PropTypes, Component} from "react";
import {getServerUrl} from "../../../../../server/utils/misc";


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
				<p><a href={`${getServerUrl()}/user/verify/${this.props.hash.token}`}>Verify email</a></p>
			</div>
		);
	}

}
