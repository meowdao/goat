import React, {Component} from "react";
import {Navbar, Nav, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";


export default class Footer extends Component {
	render() {
		return (
			<Navbar fixedBottom inverse>
				<Nav navbar>
					<LinkContainer to="contacts">
						<NavItem>Contact us</NavItem>
					</LinkContainer>
					<LinkContainer to="terms">
						<NavItem>Terms and conditions</NavItem>
					</LinkContainer>
				</Nav>

				<p className="navbar-text navbar-right">
					<a href="https://github.com/TrejGun">&copy; CTAPbIu_MABP</a>
				</p>
			</Navbar>
		);
	}
}
