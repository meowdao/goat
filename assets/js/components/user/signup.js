"use strict";

import React from "react";
import $ from "jquery";
import Profile from "./profile.js"

import Dispatcher from "../../utils/dispatcher.js";
import {ActionTypes, MessageTypes} from "../../utils/constants.js";

export default class SignUp extends React.Component {

	static propTypes = {
		email: React.PropTypes.string,
		password: React.PropTypes.string,
		confirm: React.PropTypes.string,
		firstName: React.PropTypes.string,
		lastName: React.PropTypes.string,
		role: React.PropTypes.string
	};

	static defaultProps = {
		email: "ctapbiumabp@gmail.com",
		password: "123qweASD",
		confirm: "123qweASD",
		firstName: "Fred",
		lastName: "Flinstone",
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
		$.post("/user/signup", {
			email: this.state.email,
			password: this.state.password,
			confirm: this.state.confirm,
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			role: this.state.role
		})
			.then(response => {
				Dispatcher.dispatch({
					actionType: ActionTypes.CHANGE_VIEW,
					view: Profile
				});
			})
			.catch(e => {
				Dispatcher.dispatch({
					actionType: ActionTypes.MESSAGE,
					type: MessageTypes.ERROR,
					messages:  e.responseJSON.errors
				});
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
								       onChange={e => this.setState({email: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="password" className="col-sm-2 control-label">Password</label>

							<div className="col-sm-10">
								<input type="password" className="form-control" name="password" id="password" placeholder="******"
								       onChange={e => this.setState({password: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="confirm" className="col-sm-2 control-label">Confirm password</label>

							<div className="col-sm-10">
								<input type="password" className="form-control" name="confirm" id="confirm" placeholder="******"
								       onChange={e => this.setState({confirm: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="name" className="col-sm-2 control-label">First name</label>

							<div className="col-sm-10">
								<input type="text" className="form-control" name="name" id="name" placeholder="Fred"
								       onChange={e => this.setState({firstName: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="name" className="col-sm-2 control-label">Last name</label>

							<div className="col-sm-10">
								<input type="text" className="form-control" name="name" id="name" placeholder="Flintstone"
								       onChange={e => this.setState({lastName: e.target.value})}/>
							</div>
						</div>

						<div className="form-group">
							<div className="col-sm-offset-2 col-sm-10">
								<button type="submit" className="btn btn-default">Sign Up</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}

}

