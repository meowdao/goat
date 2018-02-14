const subscription = {
	list: [],
	count: 1,
	isLoading: true,
	success: false,
	action: "view"
};

export default function subscriptionReducer(state = subscription, action) {
	switch (action.type) {
		case "subscription_view_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: [],
				count: 0,
				name: action.name
			});
		case "subscription_view_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: [action.data],
				count: 1,
				name: action.name
			});
		case "subscription_view_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		case "subscription_update_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: [],
				count: 0,
				name: action.name
			});
		case "subscription_update_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: [action.data],
				count: 1,
				name: action.name
			});
		case "subscription_update_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		default:
			return state;
	}
}
