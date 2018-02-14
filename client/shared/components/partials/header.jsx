import React, {Component} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Image} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {FormattedMessage, injectIntl} from "react-intl";
import {withRouter} from "react-router";
import {companyName} from "../../../../shared/constants/misc";
import {switchLanguage} from "../../actions/IntlActions";
import doAjaxAction from "../../actions/ajax";
import {enabledLanguages} from "../../../../shared/constants/language";
import {getServerUrl} from "../../../../shared/utils/misc";
import "./header.less";


@injectIntl
@withRouter
@connect(
	state => ({
		user: state.user
	}),
	dispatch => bindActionCreators({doAjaxAction, switchLanguage}, dispatch)
)
export default class Header extends Component {
	static propTypes = {
		doAjaxAction: PropTypes.func,
		user: PropTypes.object,

		switchLanguage: PropTypes.func
	};

	onSelect(language) {
		this.props.switchLanguage(language);
	}

	logout(e) {
		e.preventDefault();
		this.props.doAjaxAction({
			method: "GET",
			action: "/logout",
			storeName: "user",
			name: "logout"
		});
	}

	renderLogin() {
		return (
			<LinkContainer to="/login">
				<NavItem><FormattedMessage id="components.menu.login" /></NavItem>
			</LinkContainer>
		);
	}

	renderLinks() {
		const title = (
			<span>
				<Image src={this.props.user.image || `${getServerUrl("cdn")}/img/shared/icons/user.png`} circle height={25} width={25} />
				<span>{this.props.user.fullName}</span>
			</span>
		);
		switch (process.env.MODULE) {
			case "office":
				return (
					<NavDropdown title={title} id="main_menu">
						<LinkContainer to="/dashboard" exact>
							<MenuItem><FormattedMessage id="components.menu.dashboard" /></MenuItem>
						</LinkContainer>
						<MenuItem divider />
						<LinkContainer onClick={::this.logout} to="/logout">
							<MenuItem><FormattedMessage id="components.menu.logout" /></MenuItem>
						</LinkContainer>
					</NavDropdown>
				);
			case "oauth2":
				return null;
			default:
				return null;
		}
	}

	renderLang() {
		return (
			<NavDropdown title={<FormattedMessage id="components.switchLanguage" />} id="lang_menu">
				{enabledLanguages.map(language =>
					(<MenuItem key={language} eventKey={language} onSelect={::this.onSelect}>
						<FormattedMessage id={`components.language.${language}`} />
					</MenuItem>)
				)}
			</NavDropdown>
		);
	}

	renderMenu() {
		return (
			<Nav navbar pullRight>
				{this.props.user ? null : this.renderLang()}
				{this.props.user ? this.renderLinks() : this.renderLogin()}
			</Nav>
		);
	}

	render() {
		return (
			<Navbar inverse>
				<Navbar.Header>
					<Navbar.Brand>
						<Link to="/" className="navbar-brand">{companyName}</Link>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse href="#">
					{this.renderMenu()}
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
