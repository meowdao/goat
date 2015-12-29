"use strict";

import React, {PropTypes} from "react";
import Title from "./title.js";
import Messages from "./messages.js";
import Breadcrumbs from "./breadcrumbs.js";


export default class Article extends React.Component {

	static propTypes = {
		children: PropTypes.element.isRequired
	};

	render() {
		return (
			<div className="container">
				<Breadcrumbs {...this.props}/>
				<Title {...this.props}/>
				<Messages/>
				{this.props.children}
			</div>
		);
	}

}
