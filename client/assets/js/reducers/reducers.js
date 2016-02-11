"use strict";

import {combineReducers} from "redux";
import {routeReducer as routing} from "react-router-redux";
import user from "./user";
import messages from "./messages";
import twits from "./twitter";
import users from "./users";


export default combineReducers({
	routing,
	user,
	twits,
	messages,
	users
});
