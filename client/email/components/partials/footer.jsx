import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getServerUrl} from "../../../../shared/utils/misc";
import {companyName} from "../../../../shared/constants/misc";


@connect(
	state => ({
		user: state.user
	})
)
export default class Footer extends Component {
	static propTypes = {
		user: PropTypes.object
	};

	render() {
		return (
			<div>
				You&apos;re receiving this message because you signed up for notifications on {companyName}. <br />
				<a href={`${getServerUrl(process.env.MODULE)}/profile/subscriptions`}>Manage email preferences</a>
			</div>
		);
	}
}
