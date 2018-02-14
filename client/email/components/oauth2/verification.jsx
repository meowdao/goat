import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getServerUrl} from "../../../../shared/utils/misc";


@connect(
	state => state.hash
)
export default class Verification extends Component {
	static propTypes = {
		token: PropTypes.string
	};

	render() {
		return (
			<div>
				<h2>Email Verification</h2>
				<p>Please, <a href={`${getServerUrl("oauth2")}/verify/${this.props.token}`}>verify your email</a>, to get access to dashboard</p>
				<p>PS: Link is valid for 1 hour, after that you have to request new one.</p>
			</div>
		);
	}
}
