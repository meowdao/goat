import {VERIFICATION} from "../../../shared/constants/actions";


const hash = {
	token: null,
	success: false,
	isLoading: true
};

export default function hashReducer(state = hash, action) {
	switch (action.type) {
		case VERIFICATION:
			if (action.isLoading) {
				return Object.assign({}, state, {isLoading: action.isLoading});
			} else {
				return Object.assign({}, state, {isLoading: action.isLoading, success: action.success});
			}
		default:
			return state;
	}
}
