"use strict";

import React from "react";
import UserLogin from "./user/login.js";
import UserSignUp from "./user/signup.js";
import UserProfile from "./user/profile.js";
import StaticWelcome from "./static/welcome.js";
import Dispatcher from "../utils/dispatcher.js";
import ActionTypes from "../utils/constants.js";


export default class Header extends React.Component {

	state = {
		user: null
	};

	constructor(props) {
		super(props);
	}

	componentDidMount () {
		this.userToken = Dispatcher.register((payload) => {
			if (payload.actionType === ActionTypes.UPDATE_USER) {
				this.setState({user: payload.user})
			}
		});
	}

	componentWillUnmount() {
		Dispatcher.unregister(this.userToken);
	}

	onClick() {
		Dispatcher.dispatch({
			actionType: ActionTypes.CHANGE_VIEW,
			view: this
		});
	}

	renderMenu() {
		return (
			<ul className="nav navbar-nav navbar-right">
				<li className="dropdown">
					<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{this.state.user.firstName} {this.state.user.lastName} <span className="caret"></span></a>
					<ul className="dropdown-menu" role="menu">
						<li><a href="#!profile" onClick={this.onClick.bind(UserProfile)}>Profile</a></li>
						<li role="presentation" className="divider"></li>
						<li><a href="#!logout" onClick={this.onClick}>Logout</a></li>
					</ul>
				</li>
			</ul>
		);
	}

	renderLoginButton() {
		return (
			<p className="navbar-text navbar-right">
				<a href="#!login" className="navbar-link" onClick={this.onClick.bind(UserLogin)}>Login</a>
				<span> || </span>
				<a href="#!register" className="navbar-link" onClick={this.onClick.bind(UserSignUp)}>Signup</a>
			</p>
		);
	}

	render() {
		return (
			<nav className="navbar navbar-inverse">
				<div className="container">

					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="navbar-brand" href="#!welcome" onClick={this.onClick.bind(StaticWelcome)}>G.O.A.T.</a>
					</div>

					<div className="collapse navbar-collapse" id="navbar-collapse">
						{this.state.user ? this.renderMenu() : this.renderLoginButton()}
					</div>
				</div>
			</nav>
		);
	}
}
