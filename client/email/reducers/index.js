import {combineReducers} from "redux";
import {routerReducer as routing} from "react-router-redux";
import intl from "../../shared/reducers/intl";
import hash from "../../shared/reducers/hash";
import messages from "../../shared/reducers/messages";
import user from "../../shared/reducers/user";


export default combineReducers({
	intl,
	hash,
	messages,
	routing,
	user
});
