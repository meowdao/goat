"use strict";

import {combineReducers} from "redux";
import {routeReducer as routing} from "redux-simple-router";
import user from "./user.js";
import messages from "./messages.js";
import twits from "./twitter.js";
import users from "./users.js";


export default combineReducers({
	routing,
	user,
	twits,
	messages,
	users
});
