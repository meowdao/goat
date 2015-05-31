"use strict";

import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import {NavItemLink} from "react-router-bootstrap";


export default class Footer extends React.Component {
	render() {
		return (
			<Navbar fixedBottom={true} inverse={true}>
				<Nav navbar>
					<NavItemLink to="dummy">Contact us</NavItemLink>
					<NavItemLink to="dummy">Terms and conditions</NavItemLink>
				</Nav>

				<p className="navbar-text navbar-right">
					&copy; CTAPbIu_MABP
				</p>
			</Navbar>
		);
	}
}
