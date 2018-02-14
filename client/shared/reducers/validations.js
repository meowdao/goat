import {VALIDATION_ADD, VALIDATION_ADD_ALL, VALIDATION_REMOVE} from "../../../shared/constants/actions";


const messages = [];

export default function update(state = messages, action) {
	switch (action.type) {
		case VALIDATION_ADD:
			return [...state, action.data];
		case VALIDATION_ADD_ALL:
			return [...state, ...action.data];
		case VALIDATION_REMOVE:
			return state.filter(message => message !== action.data);
		default:
			return state;
	}
}
