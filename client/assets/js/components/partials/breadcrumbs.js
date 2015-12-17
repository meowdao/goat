"use strict";

import React, {PropTypes} from "react";
import {Link} from "react-router";


export default class Breadcrumbs extends React.Component {

	render() {

		var breadcrumbs = [];
		var routes = this.props.routes;
		var excludes = this.props.excludes || [];

		routes.forEach(function (route, i, arr) {
			let name, link;

			name = route.component.displayName || route.name;

			if (!name) {
				return;
			}

			if ([].concat(excludes).indexOf(name) !== -1) {
				return;
			}

			if (i === arr.length - 1) {
				link = name;
			} else {
				link = <Link to={route.path || "/"}>{name}</Link>;
			}

			breadcrumbs.push(
				<li key={i} className={i === arr.length - 1 ? "active" : ""}>{link}</li>
			);

		}, this);

		return <ol className="breadcrumb">{breadcrumbs}</ol>;
	}
}

