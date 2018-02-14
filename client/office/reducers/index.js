import {combineReducers} from "redux";
import {routerReducer as routing} from "react-router-redux";

import intl from "../../shared/reducers/intl";
import messages from "../../shared/reducers/messages";
import validations from "../../shared/reducers/validations";
import user from "../../shared/reducers/user";


export default combineReducers({
	intl,
	messages,
	routing,
	validations,
	user
});
