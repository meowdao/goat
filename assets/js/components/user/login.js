"use strict";

import React from "react";
import $ from "jquery";

import Dispatcher from "../../utils/dispatcher.js";
import ActionTypes from "../../utils/constants.js";

export default class Login extends React.Component {

	static propTypes = {
		email: React.PropTypes.string,
		password: React.PropTypes.string
	};

	static defaultProps = {
		email: "ctapbiumabp@gmail.com",
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
		$.ajax({
			method: "POST",
			url: "/user/login",
			data: {
				email: this.state.email,
				password: this.state.password
			}
		})
			.then((response) => {
				Dispatcher.dispatch({
					actionType: ActionTypes.UPDATE_USER,
					user: response
				});
			})
			.fail((e) => {
				console.log(e)
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
								<input type="text" className="form-control" name="email" id="email" placeholder="me@example.com" defaultValue=""
								       onChange={(e) => this.setState({email: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="password" className="col-sm-2 control-label">Password</label>

							<div className="col-sm-10">
								<input type="password" className="form-control" name="password" id="password" placeholder="******" defaultValue=""
								       onChange={(e) => this.setState({password: e.target.value})}/>
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
