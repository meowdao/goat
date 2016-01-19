"use strict";

import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router";
import API from "../../utils/API";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";


const logout = (data) =>
	dispatch =>
		API.logout(data)
			.then(responce => {
				dispatch({
					type: "USER_LOGOUT",
					user: responce
				});
			});

@connect(
	state => ({
		user: state.user
	}),
	dispatch => bindActionCreators({logout}, dispatch)
)
export default class Header extends Component {

	static propTypes = {
		history: PropTypes.object,
		logout: PropTypes.func,
		user: PropTypes.object
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	logout(e) {
		e.preventDefault();
		this.props.logout()
			.then(() => {
				this.context.router.push("/user/login");
			});
	}

	renderMenu() {
		return (
			<Nav navbar pullRight>
				<NavDropdown title={this.props.user.email} id="dropdown">
					<LinkContainer to="/admin/dashboard">
						<MenuItem >Dashboard</MenuItem>
					</LinkContainer>
					<MenuItem divider/>
					<MenuItem onSelect={::this.logout}>Logout</MenuItem>
				</NavDropdown>
			</Nav>
		);
	}

	renderLoginButton() {
		return (
			<Nav navbar pullRight>
				<LinkContainer to="/user/login">
					<NavItem>Login</NavItem>
				</LinkContainer>
				<LinkContainer to="/user/register">
					<NavItem>Register</NavItem>
				</LinkContainer>
			</Nav>
		);
	}

	render() {
		return (
			<Navbar inverse>
				<Navbar.Header inverse toggleNavKey={1}>
					<Navbar.Brand>
						<Link to="/" className="navbar-brand">G.O.A.T.</Link>
					</Navbar.Brand>
				</Navbar.Header>
				<Navbar.Collapse eventKey={1} href="#">
					{this.props.user ? this.renderMenu() : this.renderLoginButton()}
					<Nav navbar pullRight>
						<LinkContainer to="/twitsearch">
							<NavItem>Search Twits</NavItem>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
