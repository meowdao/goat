const typeahead = {
	list: [],
	isLoading: true,
	success: false,
	action: ""
};

export default function typeaheadReducer(state = typeahead, action) {
	switch (action.type) {
		case "vehicles_typeahead_start":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: [],
				name: action.name
			});
		case "vehicles_typeahead_success":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				list: action.data.list,
				name: action.name
			});
		case "vehicles_typeahead_error":
			return Object.assign({}, state, {
				isLoading: action.isLoading,
				success: action.success,
				name: action.name
			});
		default:
			return state;
	}
}
