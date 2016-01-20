"use strict";

import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Input, ButtonInput} from "react-bootstrap";
import zxcvbn from "zxcvbn";
import API from "../../utils/API";
import {password, confirm} from "../../../../../server/utils/constants/misc.js";


const change = (data) =>
	dispatch =>
		API.change(data)
			.then(responce => {
				dispatch({
					type: "MESSAGE",
					message: responce.message
				});
			});

@connect(
	() => ({}),
	dispatch => bindActionCreators({change}, dispatch)
)
export default class Change extends Component {

	static displayName = "Password Change";

	static propTypes = {
		password: PropTypes.string,
		confirm: PropTypes.string,
		params: PropTypes.object,
		change: PropTypes.func
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static defaultProps = {
		password,
		confirm,
		token: null
	};

	state = {
		password: this.props.password,
		confirm: this.props.confirm,
		token: this.props.params.token
	};

	onSubmit(e) {
		e.preventDefault();
		this.props.change(this.state)
			.then(() => {
				this.context.router.push("user/profile");
			});
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Change password</h3>
				</div>
				<div className="panel-body">
					<form className="form-horizontal" onSubmit={::this.onSubmit} autoComplete="off">
						<input type="hidden" name="hash" value={this.props.params.token}/>
						<Input
							type="password"
							name="password"
							value={this.state.password}
							placeholder="******"
							label="Password"
							bsStyle={zxcvbn(this.state.password).score >= 1 ? null : "error"}
							hasFeedback
							wrapperClassName="col-xs-10"
							labelClassName="col-sm-2"
							onChange={e => this.setState({password: e.target.value})}
						/>
						<Input
							type="password"
							name="confirm"
							value={this.state.confirm}
							placeholder="******"
							label="Confirm password"
							bsStyle={this.state.password === this.state.confirm ? null : "error"}
							hasFeedback
							wrapperClassName="col-xs-10"
							labelClassName="col-sm-2"
							onChange={e => this.setState({confirm: e.target.value})}
						/>
						<ButtonInput
							type="submit"
							value="Change"
							wrapperClassName="col-sm-offset-2 col-sm-10"
							disabled={this.state.disabled}
						/>
					</form>
				</div>
			</div>
		);
	}
}
