"use strict";

import {combineReducers} from "redux";
import {routeReducer as routing} from "redux-simple-router";
import user from "./user.js";
import twits from "./twitter.js";


export default combineReducers({
	user,
	routing,
	twits
});
