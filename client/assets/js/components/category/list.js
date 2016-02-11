"use strict";

import React, {PropTypes, Component} from "react";
import API from "../../utils/API";
import Tree from "../../utils/tree/tree";


export default class List extends Component {

	static displayName = "Categories";

	static propTypes = {
		categories: PropTypes.object
	};

	static defaultProps = {
		categories: new Tree([]).find()
	};

	state = {
		categories: this.props.categories
	};

	componentDidMount() {
		API.categoryList()
			.then(categories => {
				this.setState({categories: new Tree(categories).find().sort()});
			});
	}

	renderChildren(children) {
		return (
			<ul>
				{children.map((child, i) => this.renderNode(child, i))}
			</ul>
		);
	}

	renderNode(node, i) {
		return (
			<li key={i}>
				{node.data.title}
				{this.renderChildren(node.children)}
			</li>
		);
	}

	render() {
		return (
			<div>
				{this.renderChildren(this.state.categories.children)}
			</div>
		);
	}
}
