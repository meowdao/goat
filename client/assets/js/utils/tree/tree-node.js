import TreeUtils from "./tree-utils";

export default class TreeNode {
	data = {};
	parent = null;
	children = [];

	constructor(node) {
		this.data = node;
	}

	sort(sort = TreeUtils.sortByOrder) {
		this.children.sort(sort);
		this.children.forEach(e => e.sort(sort));
		return this;
	}

	setParent(parent) {
		this.parent = parent;
		this.parent.children.push(this);
		return this;
	}

	isRoot() {
		return this.data === null;
	}

	breadcrumbs(array = []) {
		let node = this;
		do { // eslint-disable-line no-cond-assign
			if (!node.isRoot()) {
				array.push(node);
			}
		} while (node = node.parent);
		return array;
	}
}
