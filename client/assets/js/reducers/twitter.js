"use strict";

const messages = [];

export default function update(state = messages, action) {
	switch (action.type) {
		case "UPDATE_TWITTER":
			return action.data;
		default:
			return state;
	}
}
