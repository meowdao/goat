"use strict";

import React from "react";
import {Input, ButtonInput} from "react-bootstrap";
import API from "../../utils/API";
import {email} from "../../../../../server/utils/constants/misc.js";


export default class Forgot extends React.Component {

	static displayName = "Password Recovery";

	static propTypes = {
		email: React.PropTypes.string,
		history: React.PropTypes.object
	};

	static defaultProps = {
		email
	};

	state = {
		email: this.props.email
	};

	onSubmit(e) {
		e.preventDefault();
		API.forgot(this.state)
			.then(() => {
				this.props.history.pushState(null, "/user/login");
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
							bsStyle={regexp.email.test(this.state.email) ? "success" : "error"}
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
