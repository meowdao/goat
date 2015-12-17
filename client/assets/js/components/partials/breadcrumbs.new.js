"use strict";

import React, {PropTypes} from "react";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";


export default class Breadcrumbs extends React.Component {

	render() {
		return <Breadcrumb>{this.props.routes.map((item, i, arr) =>
			<LinkContainer key={i} to={item.path}>
				<BreadcrumbItem>
					{item.component.displayName}
				</BreadcrumbItem>
			</LinkContainer>
		)}</Breadcrumb>;
	}

}

