import {replaceOrAppend, replaceAll} from "../utils/reducer";


const users = {
	list: [],
	count: 1,
	isLoading: true,
	success: false,
	action: ""
};

export default function usersReducer(state = users, action) {
	switch (action.type) {
		case "users_view_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: [],
				count: 0,
				name: action.name
			});
		case "users_view_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: replaceOrAppend(state, action.data),
				count: 1,
				name: action.name
			});
		case "users_view_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_list_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_list_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: replaceAll(state, action.data.list),
				count: action.data.count,
				name: action.name
			});
		case "users_list_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_update_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_update_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: replaceOrAppend(state, action.data),
				count: action.data.count,
				name: action.name
			});
		case "users_update_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_create_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_create_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: replaceOrAppend(state, action.data),
				name: action.name
			});
		case "users_create_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_forgot_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_forgot_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_forgot_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_verify_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_verify_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_verify_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_change_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_change_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_change_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_password_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_password_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_password_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_email_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_email_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "users_email_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		default:
			return state;
	}
}
