"use strict";

const messages = [];

export default function update(state = messages, action) {
	switch (action.type) {
	case "MESSAGE_ADD":
		return [...state, action.message];
	case "MESSAGE_REMOVE":
		return state.filter(message => message !== action.message.id);
	default:
		return state;
	}
}
