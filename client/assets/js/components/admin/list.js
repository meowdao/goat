"use strict";

import React from "react";
import UserList from "../partials/userlist";
import UserListForm from "../partials/userlistform.js";

export default class UserSearch extends React.Component {

	static displayName = "User Search";

	render() {
		return (
			<div className="container">
				<UserListForm />
				<UserList />
			</div>
		);
	}
}