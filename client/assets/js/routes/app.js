"use strict";

import React from "react"; // eslint-disable-line no-unused-vars
import {Route, IndexRoute, IndexRedirect} from "react-router";

import GOAT from "../components/GOAT.js";

import Welcome from "../components/static/welcome.js";

import Article from "../components/partials/article.js";
import Empty from "../components/partials/empty.js";

import TwitSearch from "../components/twitter/twitsearch.js";

// admin
import Dashboard from "../components/admin/dashboard.js";
import UserSearch from "../components/admin/users/list.js";

// user
import Login from "../components/user/login.js";
import Register from "../components/user/register.js";
import Profile from "../components/user/profile.js";
import Forgot from "../components/user/forgot.js";
import Change from "../components/user/change.js";
import UserEdit from "../components/user/edit.js";

// category
import CategoryList from "../components/category/list.js";
import CategoryAdd from "../components/category/add.js";

// page
import Airport from "../components/page/airport.js";

// error
import Message from "../components/static/message.js";

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
			<Route path="user" component={Empty}>
				<Route path="list" component={UserSearch}/>
				<Route path="edit/:_id" component={UserEdit}/>
			</Route>
		</Route>
		<Route path="twitsearch" component={Article} onEnter={setDisplayName("TwitSearch")}>
			<IndexRoute component={TwitSearch}/>
		</Route>
		<Route path="user" component={Article} onEnter={setDisplayName("User")}>
			<IndexRedirect to="profile"/>
			<Route path="edit" component={UserEdit}/>
			<Route path="login" component={Login}/>
			<Route path="register" component={Register}/>
			<Route path="profile" component={Profile}/>
			<Route path="forgot" component={Forgot}/>
			<Route path="change/:token" component={Change}/>
		</Route>
		<Route path="category" component={Article} onEnter={setDisplayName("Category")}>
			<IndexRoute component={CategoryList}/>
			<Route path="new" component={CategoryAdd}/>
			<Route path=":_id" component={CategoryList}/>
		</Route>
		<Route path="airport" component={Article} onEnter={setDisplayName("Airports")}>
			<IndexRoute component={Airport} onEnter={nextState => {nextState.params.key = 1;}}/>
			<Route path="schedule" component={Airport} onEnter={nextState => {nextState.params.key = 2;}}/>
			<Route path="flight" component={Airport} onEnter={nextState => {nextState.params.key = 3;}}/>
			<Route path="ticket" component={Airport} onEnter={nextState => {nextState.params.key = 4;}}/>
			<Route path="map" component={Airport} onEnter={nextState => {nextState.params.key = 5;}}/>
		</Route>
		<Route path="error" component={Message}/>
		<Route path="*" component={Message}/>
	</Route>
);
