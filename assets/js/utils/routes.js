"use strict";

import React from "react";
import {Route, DefaultRoute, NotFoundRoute} from "react-router";

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

void (React);

export default (
	<Route name="App" handler={GOAT} path="/">
		<DefaultRoute name="welcome" handler={Welcome}/>
		<Route name="Admin" path="/admin" handler={Article}>
			<Route name="dashboard" path="dashboard" handler={Dashboard}/>
		</Route>
		<Route name="User" path="/admin/user" handler={Article}>
			<Route name="userList" path="list" handler={UserList}/>
		</Route>
		<Route name="user" path="/user" handler={User}>
			<Route name="login" path="login" handler={Login}/>
			<Route name="register" path="register" handler={Register}/>
			<Route name="profile" path="profile" handler={Profile}/>
		</Route>
		<Route name="dummy" path="/dummy" handler={Error}/>
		<NotFoundRoute handler={Error}/>
	</Route>
);
