"use strict";

import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Input, ButtonInput} from "react-bootstrap";
import API from "../../utils/API";
import {email, password} from "../../../../../server/utils/constants/misc.js";
import {Link} from "react-router";


const login = data =>
	dispatch =>
		API.login(data)
			.then(responce => {
				dispatch({
					type: "USER_LOGIN",
					user: responce
				});
			});


@connect(
	state => ({
		user: state.user
	}),
	dispatch => bindActionCreators({login}, dispatch)
)
export default class Login extends Component {

	static displayName = "Login";

	static propTypes = {
		email: PropTypes.string,
		password: PropTypes.string,
		history: React.PropTypes.object,
		login: PropTypes.func,
		user: PropTypes.object
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
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
		this.props.login(this.state)
			.then(() => {
				this.context.router.push("/user/profile");
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

					<form className="form-horizontal" onSubmit={::this.onSubmit} autoComplete="off">
						<Input
							type="email"
							name="email"
							value={this.state.email}
							placeholder="me@example.com"
							label="Email"
							wrapperClassName="col-xs-10"
							labelClassName="col-sm-2"
							onChange={e => this.setState({email: e.target.value})}
						/>
						<Input
							type="password"
							name="password"
							value={this.state.password}
							placeholder="******"
							label="Password"
							wrapperClassName="col-xs-10"
							labelClassName="col-sm-2"
							onChange={e => this.setState({password: e.target.value})}
						/>
						<ButtonInput
							type="submit"
							value="Login"
							wrapperClassName="col-sm-offset-2 col-sm-10"
							disabled={this.state.disabled}
						/>
					</form>
				</div>
			</div>
		);
	}
}
