"use strict";

import React from "react";

export default class Breadcrumbs extends React.Component {
	render() {
		return (
			<ol className="breadcrumb">
				{this.props.breadcrumbs.map((breadcrumb) => {
					return <li><a href="{breadcrumb.url}">{breadcrumb.name}</a></li>
				})}
			</ol>
		);
	}
}
