"use strict";

import React, {PropTypes} from "react";
import {Link} from "react-router";


class Breadcrumbs extends React.Component {

	static propTypes = {
		excludes: PropTypes.arrayOf(PropTypes.string)
	};

	static contextTypes = {
		router: PropTypes.func.isRequired
	};

	render() {

		var breadcrumbs = [];
		var routes = this.context.router.getCurrentRoutes();
		var params = this.context.router.getCurrentParams();
		var excludes = this.props.excludes || [];

		routes.forEach(function (route, i, arr) {
			let name, link;

			name = route.handler.displayName || route.name;

			if (!name) {
				return;
			}

			if ([].concat(excludes).indexOf(name) !== -1) {
				return;
			}

			if (i === arr.length - 1) {
				link = name;
			} else {
				link = <Link to={route.name || "/"} params={params}>{name}</Link>;
			}

			breadcrumbs.push(
				<li key={route.name} className={i === arr.length - 1 ? "active" : ""}>{link}</li>
			);

		}, this);

		return <ol className="breadcrumb">{breadcrumbs}</ol>;
	}
}

export default Breadcrumbs;
