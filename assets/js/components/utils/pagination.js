"use strict";

import React from "react";

export default class Breadcrumbs extends React.Component {
	render() {
		return (
			<nav className="text-center">
				<ul className="pagination">
					<li>
						<a href={this.props.pagination.prev} aria-label="Previous">
							<span aria-hidden="true">&laquo;</span>
						</a>
					</li>
					{this.props.pagination.pages.map((page) => {
						return <li className="active"><a href="{page.url}">{page.text}</a></li>;
					})}
					<li>
						<a href={this.props.pagination.next} aria-label="Next">
							<span aria-hidden="true">&raquo;</span>
						</a>
					</li>
				</ul>
			</nav>
		);
	}
}
