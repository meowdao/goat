import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {injectIntl} from "react-intl";
import Loader from "../../../shared/components/partials/loader";
import doAjaxAction from "../../../shared/actions/ajax";
import {messageShow} from "../../../shared/actions/message";
import {withRouter} from "react-router";


@injectIntl
@withRouter
@connect(
	state => ({
		hash: state.hash,
		users: state.users
	}),
	dispatch => bindActionCreators({doAjaxAction, messageShow}, dispatch)
)
export default class Verification extends Component {
	static propTypes = {
		users: PropTypes.object,
		success: PropTypes.bool,
		match: PropTypes.object,
		doAjaxAction: PropTypes.func,
		messageShow: PropTypes.func,
		history: PropTypes.shape({
			push: PropTypes.func.isRequired
		}).isRequired,
		intl: PropTypes.shape({
			formatMessage: PropTypes.func.isRequired
		}).isRequired
	};

	componentDidMount() {
		this.props.doAjaxAction({
			data: this.props.match.params,
			storeName: "users",
			action: "/users/verify",
			name: "verify"
		});
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.users.isLoading && nextProps.users.name === "verify") {
			if (nextProps.users.success) {
				this.props.messageShow({
					type: "success",
					message: this.props.intl.formatMessage({
						id: "message.verification-successful"
					})
				});
			}
			this.props.history.push("/message");
		}
	}

	render() {
		// console.log("Verification:render", this.props);
		return (
			<Loader />
		);
	}
}
