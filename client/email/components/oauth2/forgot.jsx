import {connect} from "react-redux";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {getServerUrl} from "../../../../shared/utils/misc";


@connect(
	state => state.hash
)
export default class Forgot extends Component {
	static propTypes = {
		token: PropTypes.string
	};

	render() {
		return (
			<div>
				<h2>Restore your password</h2>
				<p>You told us you forgot your password. If you really did, click here to choose a new one: <a href={`${getServerUrl("oauth2")}/change/${this.props.token}`}>Change password</a></p>
				<p>If you didn't mean to reset your password, then you can just ignore this email; your password will not change.</p>
				<p>PS: Link is valid for 1 hour, after that you have to request new one.</p>
			</div>
		);
	}
}
