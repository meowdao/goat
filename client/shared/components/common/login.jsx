import React, {Component} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import "./login.less";
import doAjaxAction from "../../actions/ajax";
import {messageShow} from "../../actions/message";
import open from "../../../shared/utils/popup";


@withRouter
@connect(
	state => ({
		user: state.user
	}),
	dispatch => bindActionCreators({doAjaxAction, messageShow}, dispatch)
)
export default class Login extends Component {
	static propTypes = {
		user: PropTypes.object,
		history: PropTypes.shape({
			push: PropTypes.func.isRequired
		}).isRequired,
		doAjaxAction: PropTypes.func,
		messageShow: PropTypes.func
	};

	componentDidMount() {
		window.addEventListener("message", ::this.onMessage, false);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user) {
			this.props.history.push("/dashboard");
		}
	}

	componentWillUnmount() {
		window.removeEventListener("message", ::this.onMessage);
	}

	onMessage(event) {
		if (event.data.source === "oauth2") {
			if (event.data.message) {
				this.props.messageShow({
					type: "danger",
					message: event.data.message
				});
			} else {
				this.onLogin();
			}
		}
	}

	onLogin() {
		this.props.doAjaxAction({
			name: "sync",
			storeName: "user",
			action: "/sync"
		});
	}

	render() {
		return (
			<div className="text-center">
				<br /><br /><br />
				<a className="social goat" href="#" onClick={open("/api/auth/system")} />
			</div>
		);
	}
}
