import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router";
import API from "../../utils/API";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {USER_LOGOUT} from "../../constants/constants";


const logout = (data) =>
	dispatch =>
		API.logout(data)
			.then(responce => {
				dispatch({
					type: USER_LOGOUT,
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

	logout() {
		this.props.logout()
			.then(() => {
				this.context.router.push("/login");
			});
	}

	renderMenu() {
		return (
			<Nav navbar pullRight>
				<NavDropdown title={this.props.user.email} id="dropdown">
					<LinkContainer to="/admin">
						<MenuItem >Dashboard</MenuItem>
					</LinkContainer>
					<MenuItem divider/>
					<LinkContainer onSelect={::this.logout} to="#">
						<MenuItem>Logout</MenuItem>
					</LinkContainer>
				</NavDropdown>
			</Nav>
		);
	}

	renderLoginButton() {
		return (
			<Nav navbar pullRight>
				<LinkContainer to="/login">
					<NavItem>Login</NavItem>
				</LinkContainer>
				<LinkContainer to="/register">
					<NavItem>Register</NavItem>
				</LinkContainer>
			</Nav>
		);
	}

	render() {
		return (
			<Navbar inverse>
				<Navbar.Header>
					<Navbar.Brand>
						<Link to="/" className="navbar-brand">G.O.A.T.</Link>
					</Navbar.Brand>
				</Navbar.Header>
				<Navbar.Collapse href="#">
					{this.props.user ? this.renderMenu() : this.renderLoginButton()}
					<Nav navbar pullRight>
						<LinkContainer to="/twitsearch">
							<NavItem>Search Twits</NavItem>
						</LinkContainer>
					</Nav>
					<Nav navbar pullRight>
						<LinkContainer to="/admin">
							<NavItem>Admin</NavItem>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
