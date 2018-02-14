const user = null;

export default function updateUser(state = user, action) {
	switch (action.type) {
		case "user_sync_success":
			return action.data;
		case "user_logout_success":
			return null;
		default:
			return state;
	}
}
