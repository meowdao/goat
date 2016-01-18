"use strict";

import React, {Component} from "react";
import {Navbar, Nav, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";


export default class Footer extends Component {
	render() {
		return (
			<Navbar fixedBottom inverse>
				<Nav navbar>
					<LinkContainer to="dummy">
						<NavItem>Contact us</NavItem>
					</LinkContainer>
					<LinkContainer to="dummy">
						<NavItem>Terms and conditions</NavItem>
					</LinkContainer>
				</Nav>

				<p className="navbar-text navbar-right">
					&copy; CTAPbIu_MABP
				</p>
			</Navbar>
		);
	}
}
