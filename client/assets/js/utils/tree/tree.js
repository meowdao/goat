"use strict";

import TreeNode from "./tree-node.js";

export default class Tree {

	root = new TreeNode(null);

	constructor(data):Tree {
		const nodes = {};

		data.forEach(item => {
			nodes[item._id] = new TreeNode(item);
		});

		data.forEach(item => {
			const node = nodes[item._id];
			node.setParent(node.data.parent ? nodes[node.data.parent] : this.root);
		});

		return this;
	}

	find(_id = null, node = this.root):TreeNode {
		if ((node.isRoot() && _id === null) || (!node.isRoot() && _id === node.data._id)) {
			return node;
		} else if (node.children.length) {
			let result = null;
			for (let i = 0; result === null && i < node.children.length; i++) {
				result = this.find(_id, node.children[i]);
			}
			return result;
		}
		return null;
	}

}
