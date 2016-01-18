"use strict";

import {compose, createStore, combineReducers, applyMiddleware} from "redux";
import {syncHistory, routeReducer} from "redux-simple-router";
import reducers from "../reducers/reducers.js";
import history from "../utils/history.js";
import DevTools from "../utils/devtools.js";

const reducer = combineReducers(Object.assign({}, reducers, {
	routing: routeReducer
}));

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(history);

let store;

if (process.env.NODE_ENV !== "production") {
	const finalCreateStore = compose(
		applyMiddleware(reduxRouterMiddleware),
		DevTools.instrument()
	)(createStore);

	// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
	if (module.hot) {
		module.hot.accept("../reducers/reducers.js", () =>
			store.replaceReducer(require("../reducers/reducers.js").default)
		);
	}
	store = finalCreateStore(reducer);
} else {
	const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware)(createStore);
	store = createStoreWithMiddleware(reducer);
}

reduxRouterMiddleware.listenForReplays(store);

export default store;
