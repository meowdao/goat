import "../css/styles.less";
import "../img/favicon.ico";
import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {Router} from "react-router";
import routes from "./routes/oauth2";
import configureStore from "./utils/store";
import configureJquery from "./utils/jquery";
import history from "./utils/history";


const store = configureStore(window.__INITIAL_STATE__);
configureJquery(store);

ReactDOM.render(
	<Provider store={store}>
		<Router history={history} routes={routes} onUpdate={() => window.scrollTo(0, 0)}/>
	</Provider>,
	document.getElementById("app")
);
