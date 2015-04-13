"use strict";

import React from "react";
import Header from "./header.js";
import Article from "./article.js";
import Footer from "./footer.js";


export default class ABL extends React.Component {
	render() {
		return (
			<div>
				<Header user={this.props.user}/>
				<Article {...this.props}/>
				<Footer/>
			</div>
		);
	}
}
