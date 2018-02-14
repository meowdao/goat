import {compose, createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";
import {createLogger} from "redux-logger";
import rootReducers from "./reducers/index";


export default function(initialState = {}) {
	const middlewares = [thunkMiddleware];

	let composeEnhancers = compose;

	if (process.env.NODE_ENV === "development" && !process.env.PORT) {
		middlewares.push(createLogger());
	}

	const store = createStore(rootReducers, initialState, composeEnhancers(applyMiddleware(...middlewares)));

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept(require.resolve("./reducers"), () => {
			// https://github.com/jauco/webpack-hot-module-reload-with-context-example
			const nextRootReducer = require("./reducers/index").default;
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
}
