import React from "react"; // eslint-disable-line no-unused-vars
import {Route, IndexRoute, IndexRedirect} from "react-router";
import GOAT from "../components/blog/layout";
import Welcome from "../components/blog/static/welcome";
import Article from "../components/blog/partials/article";
import Empty from "../components/blog/partials/empty";
import TwitSearch from "../components/blog/twitter/twitsearch";
import Dashboard from "../components/blog/admin/dashboard";
import UserList from "../components/blog/admin/users/list";
import AuthenticatedComponent from "../components/blog/partials/protected";
import Login from "../components/blog/user/login";
import Register from "../components/blog/user/register";
import Profile from "../components/blog/user/profile";
import Forgot from "../components/blog/user/forgot";
import Change from "../components/blog/user/change";
import UserEdit from "../components/blog/user/edit";
import CategoryList from "../components/blog/category/list";
import CategoryAdd from "../components/blog/category/add";
import Message from "../components/blog/static/message";


function setDisplayName(displayName) {
	return (nextState) => {
		Object.assign(nextState.params, {displayName});
	};
}

function requireRoles(roles) {
	return (nextState) => {
		Object.assign(nextState.params, {roles});
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

		<Route path="error" component={Message}/>
		<Route path="contacts" component={Welcome}/>
		<Route path="terms" component={Welcome}/>
		<Route path="*" component={Message}/>
	</Route>
);
