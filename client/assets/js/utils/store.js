"use strict";

import {compose, createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {syncHistory} from "redux-simple-router";
import reducers from "../reducers/reducers.js";
import history from "./history.js";
import DevTools from "./devtools.js";

function hmr(store) {
	// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
	if (module.hot) {
		module.hot.accept("../reducers/reducers.js", () => {
			store.replaceReducer(require("../reducers/reducers.js").default);
		});
	}
}

export default function(initialState) {

	// Sync dispatched route actions to the history
	const reduxRouterMiddleware = syncHistory(history);
	const middleware = [];

	middleware.push(applyMiddleware(...[reduxRouterMiddleware, thunk]));

	if (process.env.NODE_ENV !== "production") {
		middleware.push(window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument());
		// middleware.push(window.location.href.match(/[?&]debug_session=([^&]+)\b/));
	}

	const store = compose(...middleware)(createStore)(reducers, initialState);

	reduxRouterMiddleware.listenForReplays(store);

	hmr();

	return store;
}
