"use strict";

import React, {PropTypes, Component} from "react";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";


export default class Breadcrumbs extends Component {

	static propTypes = {
		routes: PropTypes.array.isRequired
	};

	render() {
		return (<Breadcrumb>{this.props.routes.map((item, i) =>
			<LinkContainer key={i} to={item.path || "/"}>
				<BreadcrumbItem>
					{item.component.displayName}
				</BreadcrumbItem>
			</LinkContainer>
		)}</Breadcrumb>);
	}

}
