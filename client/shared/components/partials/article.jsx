import React, {Component} from "react";
import PropTypes from "prop-types";
import {Breadcrumb, Grid} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {FormattedMessage} from "react-intl";
import withStore from "../forms/withStore";


@withStore("user")
export default class Article extends Component {
	static propTypes = {
		user: PropTypes.object,
		children: PropTypes.element,
		location: PropTypes.shape({
			pathname: PropTypes.string.isRequired
		}).isRequired
	};

	renderBreadcrumbs() {
		// TODO breadcrumbs for oauth2
		if (process.env.MODULE === "oauth2" || !this.props.user) {
			return null;
		}

		const parts = this.props.location.pathname.split("/");
		if (["dashboard", "login"].includes(parts[1])) {
			return null;
		} else {
			const breadcrumbs = ["dashboard", parts[1]];
			if (["create", "edit"].includes(parts[parts.length - 1])) {
				breadcrumbs.push(parts[parts.length - 1]);
			}
			if (["return", "island", "delivery"].includes(parts[parts.length - 1])) {
				breadcrumbs.push(parts[parts.length - 1]);
			}
			if (parts[parts.length - 1].length === 24) {
				breadcrumbs.push("view");
			}
			// TODO vehicle calendar
			return (
				<Breadcrumb>
					{breadcrumbs.map((key, i) => (
						<LinkContainer key={key} to={`/${breadcrumbs.slice(~~!!i, i + 1).join("/")}`} active={i === breadcrumbs.length - 1}>
							<Breadcrumb.Item>
								<FormattedMessage id={`components.breadcrumbs.${key}`} />
							</Breadcrumb.Item>
						</LinkContainer>
					))}
				</Breadcrumb>
			);
		}
	}

	render() {
		// console.log("Article:render", this.props, this.state);
		return (
			<Grid>
				{this.renderBreadcrumbs()}
				{this.props.children}
			</Grid>
		);
	}
}
