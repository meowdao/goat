"use strict";

import _ from "lodash";

const users = {
	users: [],
	count: 0
};

export default function update(state = users, action) {
	switch (action.type) {
		case "USER_LIST":
			return {
				users: action.data.list,
				count: action.data.count
			};
		case "USERS_UPDATE":
			const updatedUsers = state.users.slice();
			const key = _.findIndex(updatedUsers, ["_id", action.data._id]);
			updatedUsers[key] = action.data;
			return {
				users: updatedUsers,
				count: state.count
			};
		default:
			return state;
	}
}
