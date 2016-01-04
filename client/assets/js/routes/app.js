"use strict";

import React from "react"; // eslint-disable-line no-unused-vars
import {Route, IndexRoute, IndexRedirect} from "react-router";

import GOAT from "../components/GOAT.js";

import Welcome from "../components/static/welcome.js";

import Article from "../components/partials/article.js";

// admin
import Dashboard from "../components/admin/dashboard.js";
import UserList from "../components/admin/users/list.js";

// user
import Login from "../components/user/login.js";
import Register from "../components/user/register.js";
import Profile from "../components/user/profile.js";
import Forgot from "../components/user/forgot.js";
import Change from "../components/user/change.js";

// category
import CategoryList from "../components/category/list.js";
import CategoryAdd from "../components/category/add.js";

// error
import Message from "../components/static/message.js";

// import UserStore from "../stores/UserStore.js";
import MessageStore from "../stores/MessageStore.js";

import {ActionTypes} from "../constants/constants.js";

function setDisplayName(displayName) {
	return (nextState) => {
		nextState.params.displayName = displayName;
	};
}

export default (
	<Route path="/" component={GOAT}>
		<IndexRoute component={Welcome}/>
		<Route path="admin" component={Article} onEnter={setDisplayName("Admin")}>
			<IndexRoute component={Dashboard}/>
			<Route path="user">
				<Route path="list" component={UserList}/>
			</Route>
		</Route>
		<Route path="user" component={Article} onEnter={setDisplayName("User")}>
			<IndexRedirect to="profile"/>
			<Route path="login" component={Login}/>
			<Route path="register" component={Register}/>
			<Route path="profile" component={Profile}/>
			<Route path="forgot" component={Forgot}/>
			<Route path="change/:token" component={Change}/>
		</Route>
		<Route path="category" component={Article} onEnter={setDisplayName("Category")}>
			<IndexRoute component={CategoryList}/>
			<Route path="category/new" component={CategoryAdd}/>
			<Route path="category/:_id" component={CategoryList}/>
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
