"use strict";

import React, {PropTypes} from "react";
import API from "../../utils/API";
import {email, password} from "../../../../../server/utils/constants/misc.js";
import {Link} from "react-router";


export default class Login extends React.Component {

	static displayName = "Login";

	static propTypes = {
		email: PropTypes.string,
		password: PropTypes.string,
		history: React.PropTypes.object
	};

	static defaultProps = {
		email,
		password
	};

	state = {
		email: this.props.email,
		password: this.props.password
	};

	onSubmit(e) {
		e.preventDefault();
		API.login(this.state)
		.then(() => {
			this.props.history.pushState(null, "/user/profile");
		});
	}

	open(link) {
		return e => {
			e.preventDefault();
			const n = 600;
			const r = 400;
			const i = (window.innerHeight - r) / 2;
			const s = (window.innerWidth - n) / 2;
			const popup = window.open(link, "authorization", "height=" + r + ",width=" + n + ",top=" + i + ",left=" + s);
			if (window.focus) {
				popup.focus();
			}
		};
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">

					[<a href="#" onClick={this.open("/auth/google")}>google</a> ,
					<a href="#" onClick={this.open("/auth/facebook")}>facebook</a>]

					[<Link to="/user/forgot">Forgot password?</Link>]

					<form className="form-horizontal" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
						<div className="form-group">
							<label htmlFor="email" className="col-sm-2 control-label">Email</label>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="email" id="email"
									placeholder="me@example.com"
									onChange={e => this.setState({email: e.target.value})}
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="password" className="col-sm-2 control-label">Password</label>
							<div className="col-sm-10">
								<input type="password" className="form-control" name="password" id="password"
									placeholder="******"
									onChange={e => this.setState({password: e.target.value})}
								/>
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
