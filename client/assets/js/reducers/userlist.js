"use strict";

const users = [];

export default function update(state = users, action) {
	switch (action.type) {
		case "USER_LIST":
			return action.user;
		default:
			return state;
	}
}
