"use strict";

import React from "react";
import {Link} from "react-router";
import AdminStore from "../../stores/AdminStore.js";
import UserActionCreators from "../../actions/UserActionCreators.js";
import {CollapsibleNav, Navbar, Nav, DropdownButton, MenuItem} from "react-bootstrap";
import {MenuItemLink, NavItemLink} from "react-router-bootstrap";

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
			<Nav navbar right>
				<DropdownButton title={this.state.user.email}>
					{/* https://github.com/react-bootstrap/react-router-bootstrap/issues/24 */}
					<MenuItemLink to="dashboard">Dashboard</MenuItemLink>
					<MenuItem divider/>
					<MenuItem onSelect={this.logout}>Logout</MenuItem>
				</DropdownButton>
			</Nav>
		);
	}

	renderLoginButton() {
		return (
			<Nav navbar right>
				<NavItemLink to="login">Login</NavItemLink>
			</Nav>
		);
	}

	render() {
		let brand = <Link to="welcome" className="navbar-brand">Adventure Bucket List</Link>;
		return (
			<Navbar brand={brand} inverse={true} toggleNavKey={1}>
				<CollapsibleNav eventKey={1}>
					{AdminStore.isLoggedIn() ? this.renderMenu() : this.renderLoginButton()}
				</CollapsibleNav>
			</Navbar>
		);
	}
}
