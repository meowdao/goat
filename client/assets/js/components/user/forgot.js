"use strict";

import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Input, ButtonInput} from "react-bootstrap";
import API from "../../utils/API";
import {reEmail} from "../../../../../server/utils/constants/regexp.js";
import {email} from "../../../../../server/utils/constants/misc.js";


const forgot = (data) =>
	dispatch =>
		API.forgot(data)
			.then(responce => {
				dispatch({
					type: "MESSAGE",
					message: responce.message
				});
			});

@connect(
	() => ({}),
	dispatch => bindActionCreators({forgot}, dispatch)
)
export default class Forgot extends Component {

	static displayName = "Password Recovery";

	static propTypes = {
		email: PropTypes.string,
		history: PropTypes.object,
		forgot: PropTypes.func
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static defaultProps = {
		email
	};

	state = {
		email: this.props.email
	};

	onSubmit(e) {
		e.preventDefault();
		this.props.forgot(this.state)
			.then(() => {
				this.context.router.push("error");
			});
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Forgot password</h3>
				</div>
				<div className="panel-body">
					<form className="form-horizontal" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
						<Input
							type="email"
							name="email"
							value={this.state.email}
							placeholder="me@example.com"
							label="Email"
							bsStyle={reEmail.test(this.state.email) ? null : "error"}
							hasFeedback
							wrapperClassName="col-xs-10"
							labelClassName="col-sm-2"
							onChange={e => this.setState({email: e.target.value})}
						/>
						<ButtonInput
							type="submit"
							value="Send email"
							wrapperClassName="col-sm-offset-2 col-sm-10"
							disabled={this.state.disabled}
						/>
					</form>
				</div>
			</div>
		);
	}
}
