"use strict";

import React, {PropTypes} from "react";
import UserActionCreator from "../../actions/UserActionCreators.js";
import {History} from "react-router";

class Login extends React.Component {

	static displayName = "Login";

	static propTypes = {
		email: PropTypes.string,
		password: PropTypes.string
	};

	static defaultProps = {
		email: "trejgun@gmail.com",
		password: "123qweASD"
	};

	state = {
		email: this.props.email,
		password: this.props.password
	};

	constructor(props) {
		super(props);
	}

	onSubmit(e) {
		e.preventDefault();
		UserActionCreator.login(this.state);
	}

	open(link) {
		return e => {
			e.preventDefault();
			let
				n = 600,
				r = 400,
				i = (window.innerHeight - r) / 2,
				s = (window.innerWidth - n) / 2,
				popup = window.open(link, "authorization", "height=" + r + ",width=" + n + ",top=" + i + ",left=" + s);
			if (window.focus) {
				popup.focus();
			}
		};
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">

					<a href="#" onClick={this.open("/auth/google")}>google</a>

					<form className="form-horizontal" onSubmit={this.onSubmit.bind(this)} autoComplete="off">

						<div className="form-group">
							<label htmlFor="email" className="col-sm-2 control-label">Email</label>

							<div className="col-sm-10">
								<input type="text" className="form-control" name="email" id="email"
									placeholder="me@example.com" defaultValue=""
									onChange={e => this.setState({email: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="password" className="col-sm-2 control-label">Password</label>

							<div className="col-sm-10">
								<input type="password" className="form-control" name="password" id="password"
									placeholder="******" defaultValue=""
									onChange={e => this.setState({password: e.target.value})}/>
							</div>
						</div>

						<div className="form-group">
							<div className="col-sm-offset-2 col-sm-10">
								<button type="submit" className="btn btn-default">Login</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;
