import React from "react"; // eslint-disable-line no-unused-vars
import {Route, IndexRoute, IndexRedirect} from "react-router";
import GOAT from "../components/GOAT";
import Welcome from "../components/static/welcome";
import Article from "../components/partials/article";
import Empty from "../components/partials/empty";
import TwitSearch from "../components/twitter/twitsearch";
import Dashboard from "../components/admin/dashboard";
import UserList from "../components/admin/users/list";
import AuthenticatedComponent from "../components/partials/protected";
import Login from "../components/user/login";
import Register from "../components/user/register";
import Profile from "../components/user/profile";
import Forgot from "../components/user/forgot";
import Change from "../components/user/change";
import UserEdit from "../components/user/edit";
import CategoryList from "../components/category/list";
import CategoryAdd from "../components/category/add";
import Airport from "../components/page/airport";
import Message from "../components/static/message";


function setDisplayName(displayName) {
	return (nextState) => {
		nextState.params.displayName = displayName;
	};
}

function requireRoles(roles) {
	return (nextState) => {
		nextState.params.roles = roles;
	};
}

export default (
	<Route path="/" component={GOAT}>
		<IndexRoute component={Welcome}/>
		<Route path="admin" component={AuthenticatedComponent} onEnter={requireRoles(["admin"])}>
			<IndexRoute component={Dashboard}/>
			<Route path="user" component={Empty}>
				<Route path="edit/:_id" component={UserEdit}/>
				<Route path="list" component={UserList}/>
			</Route>
		</Route>
		<Route path="twitsearch" component={Article} onEnter={setDisplayName("TwitSearch")}>
			<IndexRoute component={TwitSearch}/>
		</Route>

		<Route path="user" component={AuthenticatedComponent} onEnter={requireRoles(["admin", "user"])}>
			<IndexRedirect to="profile"/>
			<Route path="edit" component={UserEdit}/>
			<Route path="profile" component={Profile}/>
		</Route>

		<Route path="login" component={Article} onEnter={setDisplayName("User login")}>
			<IndexRoute component={Login}/>
		</Route>
		<Route path="register" component={Article} onEnter={setDisplayName("User register")}>
			<IndexRoute component={Register}/>
		</Route>
		<Route path="forgot" component={Article} onEnter={setDisplayName("Forgot")}>
			<IndexRoute component={Forgot}/>
		</Route>
		<Route path="change/:token" component={Article} onEnter={setDisplayName("Change")}>
			<IndexRoute component={Change}/>
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
