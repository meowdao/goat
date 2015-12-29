"use strict";

import React, {PropTypes} from "react";
import API from "../../utils/API";
import {email, password, confirm, firstName, lastName} from "../../../../../server/utils/constants/misc.js";


export default class Register extends React.Component {

	static displayName = "Register";

	static propTypes = {
		email: PropTypes.string,
		password: PropTypes.string,
		confirm: PropTypes.string,
		firstName: PropTypes.string,
		lastName: PropTypes.string,
		companyName: PropTypes.string,
		role: PropTypes.string,
		history: React.PropTypes.object
	};

	static defaultProps = {
		email,
		password,
		confirm,
		firstName,
		lastName,
		companyName: "Bintang",
		role: "admin"
	};

	state = {
		email: this.props.email,
		password: this.props.password,
		confirm: this.props.confirm,
		firstName: this.props.firstName,
		lastName: this.props.lastName,
		companyName: this.props.companyName,
		role: this.props.role
	};

	onSubmit(e) {
		e.preventDefault();
		API.register(this.state)
		.then(() => {
			this.props.history.pushState(null, "/user/profile");
		});
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<form className="form-horizontal" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
						<div className="form-group">
							<label htmlFor="email" className="col-sm-2 control-label">Email</label>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="email" id="email" placeholder="me@example.com"
									onChange={e => this.setState({email: e.target.value})}
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="password" className="col-sm-2 control-label">Password</label>
							<div className="col-sm-10">
								<input type="password" className="form-control" name="password" id="password" placeholder="******"
									onChange={e => this.setState({password: e.target.value})}
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="confirm" className="col-sm-2 control-label">Confirm password</label>
							<div className="col-sm-10">
								<input type="password" className="form-control" name="confirm" id="confirm" placeholder="******"
									onChange={e => this.setState({confirm: e.target.value})}
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="firstName" className="col-sm-2 control-label">First name</label>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="firstName" id="firstName" placeholder="Fred"
									onChange={e => this.setState({firstName: e.target.value})}
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="lastName" className="col-sm-2 control-label">Last name</label>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="lastName" id="lastName" placeholder="Flintstone"
									onChange={e => this.setState({lastName: e.target.value})}
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="phoneNumber" className="col-sm-2 control-label">Phone number</label>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="phoneNumber" id="phoneNumber" placeholder="+1234567890"
									onChange={e => this.setState({contactName: e.target.value})}
								/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-sm-offset-2 col-sm-10">
								<button type="submit" className="btn btn-default">Register</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}
