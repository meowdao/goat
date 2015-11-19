"use strict";

import React from "react";
import {Route, IndexRoute} from "react-router";

import GOAT from "../components/GOAT.js";

import Article from "../components/partials/article.js";

import Welcome from "../components/static/welcome.js";
import Error from "../components/static/error.js";

import Dashboard from "../components/admin/dashboard.js";
import UserList from "../components/admin/users/list.js";

import User from "../components/user/user.js";
import Login from "../components/user/login.js";
import Register from "../components/user/register.js";
import Profile from "../components/user/profile.js";

//import AdminStore from "../stores/AdminStore.js";

void (React);

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
		</Route>
		<Route path="dummy" component={Error}/>
		<Route path="*" component={Error}/>
	</Route>
);
