"use strict";

import React, {PropTypes, Component} from "react";
import classnames from "classnames";
import {connect} from "react-redux";


@connect(
	state => ({
		users: state.users
	})
)
export default class UserList extends Component {

	static displayName = "User List";

	static propTypes = {
		users: PropTypes.array
	};

	static defaultProps = {
		users: []
	};

	renderListItem(user) {
		return (
			<li key={user._id} className="list-group-item">
				<button className={classnames("pull-right", "btn", user.isActive ? "btn-success" : "btn-danger")}
					onClick={() => this.sync(user)} type="button"
				>
					{user.isActive ? "Active" : "Inactive"}
				</button>

				<h4 className="list-group-item-heading">{user.contactName}</h4>
				Email: {user.email}<br/>
				Company: {user.companyName}<br/>
				Phone: {user.phoneNumber}<br/>
			</li>
		);
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<ul className="list-group">
						{this.props.users.map(this.renderListItem)}
					</ul>
				</div>
			</div>
		);
	}
}
