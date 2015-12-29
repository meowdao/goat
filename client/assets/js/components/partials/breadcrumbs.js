"use strict";

import React, {PropTypes} from "react";
import {Link} from "react-router";


export default class Breadcrumbs extends React.Component {

	static propTypes = {
		routes: PropTypes.array.isRequired,
		excludes: PropTypes.array
	};

	render() {

		const breadcrumbs = [];
		const routes = this.props.routes;
		const excludes = this.props.excludes || [];

		routes.forEach((route, i, arr) => {
			let name;
			let link;

			if (!route.component) {
				return;
			}

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
