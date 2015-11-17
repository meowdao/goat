"use strict";

import React, {PropTypes} from "react";
import UserActionCreator from "../../actions/UserActionCreators.js";

export default class Register extends React.Component {

	static propTypes = {
		email: PropTypes.string,
		password: PropTypes.string,
		confirm: PropTypes.string,
		firstName: PropTypes.string,
		lastName: PropTypes.string,
		role: PropTypes.string
	};

	static defaultProps = {
		email: "trejgun@gmail.com",
		password: "123qweASD",
		confirm: "123qweASD",
		firstName: "Trej",
		lastName: "Gun",
		role: "admin"
	};

	state = {
		email: this.props.email,
		password: this.props.password,
		confirm: this.props.confirm,
		firstName: this.props.firstName,
		lastName: this.props.lastName,
		role: this.props.role
	};

	constructor(props) {
		super(props);
	}

	onSubmit(e) {
		e.preventDefault();
		UserActionCreator.register(this.state);
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<form className="form-horizontal" onSubmit={this.onSubmit.bind(this)} autoComplete="off">

						<div className="form-group">
							<label htmlFor="email" className="col-sm-2 control-label">Email</label>

							<div className="col-sm-10">
								<input type="text" className="form-control" name="email" id="email"
									placeholder="me@example.com"
									onChange={e => this.setState({email: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="password" className="col-sm-2 control-label">Password</label>

							<div className="col-sm-10">
								<input type="password" className="form-control" name="password" id="password"
									placeholder="******"
									onChange={e => this.setState({password: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="confirm" className="col-sm-2 control-label">Confirm password</label>

							<div className="col-sm-10">
								<input type="password" className="form-control" name="confirm" id="confirm"
									placeholder="******"
									onChange={e => this.setState({confirm: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="firstName" className="col-sm-2 control-label">First name</label>

							<div className="col-sm-10">
								<input type="text" className="form-control" name="firstName" id="firstName"
									placeholder="Fred Flintstone"
									onChange={e => this.setState({firstName: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="lastName" className="col-sm-2 control-label">Last name</label>

							<div className="col-sm-10">
								<input type="text" className="form-control" name="lastName" id="lastName"
									placeholder="Fred Flintstone"
									onChange={e => this.setState({lastName: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="contactName" className="col-sm-2 control-label">Role</label>

							<div className="col-sm-10">
								<select className="form-control" name="role" id="role"
									onChange={e => this.setState({role: e.target.value})}>
									<option value="admin">Admin</option>
									<option value="host">Host</option>
									<option value="operator">Operator</option>
								</select>
							</div>
						</div>

						{this.state.role === "operator" && this.renderOperator()}

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

	renderOperator() {
		return (
			<div>
				<div className="form-group">
					<label htmlFor="phoneNumber" className="col-sm-2 control-label">Phone number</label>

					<div className="col-sm-10">
						<input type="text" className="form-control" name="phoneNumber" id="phoneNumber"
							placeholder="+1234567890"
							onChange={e => this.setState({contactName: e.target.value})}/>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="contactName" className="col-sm-2 control-label">Domain name</label>

					<div className="col-sm-10">
						<input type="text" className="form-control" name="domainName" id="domainName"
							placeholder="examle.com"
							onChange={e => this.setState({contactName: e.target.value})}/>
					</div>
				</div>
			</div>
		);
	}
}

