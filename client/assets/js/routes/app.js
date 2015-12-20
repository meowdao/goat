"use strict";

import React from "react"; // eslint-disable-line no-unused-vars
import {Route, IndexRoute, Redirect} from "react-router";

import GOAT from "../components/GOAT.js";

import Article from "../components/partials/article.js";

import Welcome from "../components/static/welcome.js";
import Message from "../components/static/message.js";

import Dashboard from "../components/admin/dashboard.js";
import UserList from "../components/admin/users/list.js";

import User from "../components/user/user.js";
import Login from "../components/user/login.js";
import Register from "../components/user/register.js";
import Profile from "../components/user/profile.js";
import Forgot from "../components/user/forgot.js";
import Change from "../components/user/change.js";

//import AdminStore from "../stores/AdminStore.js";
import MessageStore from "../stores/MessageStore.js";

import {ActionTypes} from "../constants/constants.js";


export default (
	<Route path="/" component={GOAT}>
		<IndexRoute component={Welcome}/>
		<Route path="admin" component={Article}>
			<Route path="dashboard" component={Dashboard} onEnter={() => {}}/>
			<Route path="user" component={Article}>
				<Route path="list" component={UserList}/>
			</Route>
		</Route>
		<Route path="user" component={User}>
			<Route path="login" component={Login}/>
			<Route path="register" component={Register}/>
			<Route path="profile" component={Profile}/>
			<Route path="forgot" component={Forgot}/>
			<Route path="change/:hash" component={Change}/>
		</Route>
		<Route path="error" component={Message}/>
		<Route path="*" component={Message}
			onEnter={() => {
				MessageStore.remove();
				MessageStore._registerToActions({
					actionType: ActionTypes.ERROR,
					messages: ["Page Not Found"]
				});
			}}
			onLeave={() => {
				MessageStore.remove();
			}}
		/>
	</Route>
);


