import {combineReducers} from "redux";
import {routerReducer as routing} from "react-router-redux";
import user from "./user";
import messages from "./messages";
import twits from "./twitter";
import users from "./users";
import oauth2 from "./oauth2";
import hash from "./hash";


export default combineReducers({
	hash,
	messages,
	routing,
	twits,
	oauth2,
	user,
	users
});
