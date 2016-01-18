"use strict";

import {combineReducers} from "redux";
import {routeReducer as routing} from "redux-simple-router";
import user from "./user.js";


export default combineReducers({
	user,
	routing
});
