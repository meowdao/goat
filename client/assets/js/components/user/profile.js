"use strict";

import React, {Component} from "react";
import {Link} from "react-router";

export default class Profile extends Component {

	static displayName = "Profile";

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<div className="list-group">
							<Link to="/user/edit" className="list-group-item">User Edit</Link>
					</div>
				</div>
			</div>
		);
	}
}
