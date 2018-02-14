import {combineReducers} from "redux";
import {routerReducer as routing} from "react-router-redux";

import oauth2 from "./oauth2";

import hash from "../../shared/reducers/hash";
import intl from "../../shared/reducers/intl";
import messages from "../../shared/reducers/messages";
import validations from "../../shared/reducers/validations";
import user from "../../shared/reducers/user";
import users from "../../shared/reducers/users";


export default combineReducers({
	intl,
	hash,
	messages,
	oauth2,
	routing,
	validations,
	users,
	user
});
