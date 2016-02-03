"use strict";

import React, {PropTypes, Component} from "react";
import classnames from "classnames";
import {connect} from "react-redux";
import API from "../../../utils/API";
import {bindActionCreators} from "redux";
import {Button} from "react-bootstrap";

const userUpdate = data =>
	dispatch =>
		API.updateUsers(data)
			.then(response => {
				dispatch({
					type: "USERS_UPDATE",
					data: response
				});
			});

@connect(
	state => ({
		users: state.users.usersData
	}),
	dispatch => bindActionCreators({userUpdate}, dispatch)
)
export default class UserList extends Component {

	static displayName = "User List";

	static propTypes = {
		users: PropTypes.array,
		usersUpdate: PropTypes.func
	};

	static defaultProps = {
		users: [],
		userId: null
	};

	isActiveChange(user) {
		Object.assign(user, {isActive: !user.isActive});
		this.props.userUpdate(user);
	}

	isEmailVerifiedChange(user) {
		Object.assign(user, {isEmailVerified: !user.isEmailVerified});
		this.props.userUpdate(user);
	}

	showList() {
		return (
			<ul className="list-group">
				{this.props.users.length === 0 ? "Nothing to display" : this.props.users.map(::this.renderListItem)}
			</ul>

		);
	}

	renderListItem(user) {
		return (
			<li key={user._id} className="list-group-item">
				<Button className="pull-right" bsStyle={user.isEmailVerified ? "success" : "danger"}
				        onClick={() => this.isEmailVerifiedChange(user)} bsSize="small"
				>
					{user.isEmailVerified ? "Verified" : "Not verified"}
				</Button>
				<Button className="pull-right" bsStyle={user.isActive ? "success" : "danger"}
				        onClick={() => this.isActiveChange(user)} bsSize="small"
				>
					{user.isActive ? "Active" : "Not active"}
				</Button>

				<h4 className="list-group-item-heading">{`${user.firstName} ${user.lastName}`}</h4>
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
						<div className="col-sm-8">
							{this.showList()}
						</div>
					</div>
				</div>
			</div>
		)
	}
}
