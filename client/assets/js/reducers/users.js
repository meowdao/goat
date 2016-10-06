import _ from "lodash";
import {UPDATE_USER_LIST, UPDATE_USER} from "../constants/constants";


const users = {
	usersData: [],
	count: 0
};

export default function update(state = users, action) {
	switch (action.type) {
		case UPDATE_USER_LIST:
			return {
				usersData: action.data.list,
				count: action.data.count
			};
		case UPDATE_USER:
			const updatedUsers = state.usersData.slice();
			const key = _.findIndex(updatedUsers, ["_id", action.data._id]);
			updatedUsers[key] = action.data;
			return {
				usersData: updatedUsers,
				count: state.count
			};
		default:
			return state;
	}
}
