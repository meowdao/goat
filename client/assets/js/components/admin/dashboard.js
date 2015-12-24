"use strict";

import React from "react";
import {Link} from "react-router";


export default class Dashboard extends React.Component {

	static displayName = "Dashboard";

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<div className="list-group">
						<Link to="admin/user/list" className="list-group-item">User List</Link>
					</div>
				</div>
			</div>
		);
	}
}
