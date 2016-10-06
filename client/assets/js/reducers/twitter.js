import {UPDATE_TWITTER_LIST} from "../constants/constants";

const messages = [];

export default function update(state = messages, action) {
	switch (action.type) {
		case UPDATE_TWITTER_LIST:
			return action.data;
		default:
			return state;
	}
}
