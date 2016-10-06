export default class TreeUtils {
	static sortByOrder(a, b) {
		if (a.data.order === b.data.order) {
			return TreeUtils.sortByTitle(a, b);
		} else {
			return a.data.order > b.data.order ? 1 : -1;
		}
	}

	static sortByTitle(a, b) {
		return a.data.title > b.data.title ? 1 : -1;
	}
}
