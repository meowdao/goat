"use strict";

import React from "react";
import {Link} from "react-router";
import AdminStore from "../../stores/AdminStore.js";
import UserActionCreators from "../../actions/UserActionCreators.js";
import {CollapsibleNav, Navbar, NavbarBrand, Nav, NavItem, NavDropdown, MenuItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

export default class Header extends React.Component {

	state = {
		user: null
	};

	constructor(props) {
		super(props);
		this.state = this.getStateFromStores();
	}

	getStateFromStores() {
		return {
			user: AdminStore.getCurrent()
		};
	}

	componentDidMount() {
		AdminStore.addChangeListener(this._onChange.bind(this));
	}

	componentWillUnmount() {
		AdminStore.removeChangeListener(this._onChange.bind(this));
	}

	_onChange() {
		this.setState(this.getStateFromStores());
	}

	logout() {
		UserActionCreators.logout();
	}

	renderMenu() {
		return (
			<Nav navbar pullRight>
				<NavDropdown title={this.state.user.email} id="dropdown">
					{/* https://github.com/react-bootstrap/react-router-bootstrap/issues/24 */}
					<LinkContainer to="/admin/dashboard">
						<MenuItem >Dashboard</MenuItem>
					</LinkContainer>
					<MenuItem divider/>
					<MenuItem onSelect={this.logout}>Logout</MenuItem>
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
						<Link to="/" className="navbar-brand">Adventure Bucket List</Link>
					</Navbar.Brand>
				</Navbar.Header>
				<Navbar.Collapse eventKey={1} href="#">
					{AdminStore.isLoggedIn() ? this.renderMenu() : this.renderLoginButton()}
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
