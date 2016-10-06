import React from "react"; // eslint-disable-line no-unused-vars
import Popup from "../components/oauth2/popup";
import Login from "../components/oauth2/login";
import Decision from "../components/oauth2/decision";
import {Route, IndexRoute} from "react-router";


export default (
	<Route path="/" component={Popup}>
		<IndexRoute component={Login}/>
		<Route path="login" component={Login} />
		<Route path="dialog/authorize" component={Decision} />
	</Route>
);
