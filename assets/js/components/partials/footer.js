"use strict";

import React from "react";
import {Navbar, Nav, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";


export default class Footer extends React.Component {
	render() {
		return (
			<Navbar fixedBottom={true} inverse={true}>
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
