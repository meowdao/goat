"use strict";

import React from "react";
import {RouteHandler} from "react-router";
import Title from "./title.js";
import Messages from "./messages.js";
import Breadcrumbs from "./breadcrumbs.js";
import AdminStore from "../../stores/AdminStore.js";


export default class Article extends React.Component {

	render() {
		return (
			<div className="container">
				<Breadcrumbs/>
				<Title {...this.props}/>
				<Messages/>
				{this.props.children}
			</div>
		);
	}

}

