import {combineReducers} from "redux";
import {routeReducer as routing} from "react-router-redux";
import user from "./user";
import messages from "./messages";
import twits from "./twitter";
import users from "./users";
import hash from "./hash";


export default combineReducers({
	hash,
	messages,
	routing,
	twits,
	user,
	users
});
