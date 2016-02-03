"use strict";

import React from "react";
import UserList from "./list/list";
import UserListForm from "./list/form.js";

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