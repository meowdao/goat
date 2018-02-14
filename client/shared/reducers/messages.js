import {MESSAGE_ADD, MESSAGE_ADD_ALL, MESSAGE_REMOVE} from "../../../shared/constants/actions";


const messages = [];

export default function update(state = messages, action) {
	switch (action.type) {
		case MESSAGE_ADD:
			return [...state, action.data];
		case MESSAGE_ADD_ALL:
			return [...state, ...action.data];
		case MESSAGE_REMOVE:
			return state.filter(message => message !== action.data);
		default:
			return state;
	}
}
