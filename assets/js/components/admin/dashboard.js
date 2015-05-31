"use strict";

import React from "react";
import {Link} from "react-router";
import AdminStore from "../../stores/AdminStore.js";

export default class Dashboard extends React.Component {

	static displayName = "Dashboard";

	static willTransitionTo(transition) {
		if (!AdminStore.isLoggedIn()) {
			transition.redirect("/");
		}
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<div className="list-group">
						<Link to="userList" className="list-group-item">User List</Link>
					</div>
				</div>
			</div>
		);
	}
}
