import {compose, createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";
import reducers from "../reducers/reducers";
import createLogger from "redux-logger";


export default function (initialState = {}) {
	return compose(
		applyMiddleware(thunkMiddleware, createLogger())
	)(createStore)(reducers, initialState);
}
