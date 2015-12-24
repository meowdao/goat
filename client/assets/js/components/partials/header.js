"use strict";

import React from "react";
import {Link} from "react-router";
import API from "../../utils/API";
import AdminStore from "../../stores/AdminStore.js";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

export default class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.getStateFromStores();
	}

	state = {
		user: null
	};

	componentDidMount() {
		AdminStore.addChangeListener(this._onChange.bind(this));
	}

	componentWillUnmount() {
		AdminStore.removeChangeListener(this._onChange.bind(this));
	}

	getStateFromStores() {
		return {
			user: AdminStore.getCurrent()
		};
	}

	_onChange() {
		this.setState(this.getStateFromStores());
	}

	logout(e) {
		e.preventDefault();
		API.logout()
			.then(() => {
				this.props.history.pushState(null, "/user/login");
			});
	}

	renderMenu() {
		return (
			<Nav navbar pullRight>
				<NavDropdown title={this.state.user.email} id="dropdown">
					<LinkContainer to="/admin/dashboard">
						<MenuItem >Dashboard</MenuItem>
					</LinkContainer>
					<MenuItem divider/>
					<MenuItem onSelect={this.logout.bind(this)}>Logout</MenuItem>
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
				<Navbar.Header inverse={true} toggleNavKey={1}>
					<Navbar.Brand>
						<Link to="/" className="navbar-brand">G.O.A.T.</Link>
					</Navbar.Brand>
				</Navbar.Header>
				<Navbar.Collapse eventKey={1} href="#">
					{AdminStore.isLoggedIn() ? this.renderMenu() : this.renderLoginButton()}
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
