"use strict";

import React, {PropTypes, Component} from "react";
import classnames from "classnames";
import {connect} from "react-redux";


@connect(
	state => ({
		users: state.users.list
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
				<button className={classnames("pull-right", "btn", user.isEmailVerified ? "btn-success" : "btn-danger")}
				        onClick={() => this.sync(user)} type="button"
				>
					{user.isEmailVerified ? "Verified" : "Not verified"}
				</button>
				<h4 className="list-group-item-heading">{user.contactName}</h4>
				First Name: {user.firstName}<br/>
				Last Name: {user.lastName}<br/>
				Email: {user.email}<br/>
				Company: {user.companyName}<br/>
				Phone: {user.phoneNumber}<br/>
				Created: {user.created}<br/>
			</li>

		);
	}

	render() {
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-sm-5">
							<ul className="list-group">
								{this.props.users.length == 0 ? "Nothing to display" : this.props.users.map(this.renderListItem)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
