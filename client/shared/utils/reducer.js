export function replaceOrAppend(state, current) {
	// console.log("# replaceOrAppend");
	const index = state.list.findIndex(item => item._id === current._id);
	// console.log("index", index, !~index)
	if (~index) {
		state.list.splice(index, 1, current);
	} else {
		state.list.push(current);
	}
	// console.log(state.list)
	return state.list;
}

export function replaceOrPrepend(state, current) {
	// console.log("# replaceOrAppend");
	const index = state.list.findIndex(item => item._id === current._id);
	// console.log("index", index, !~index)
	if (~index) {
		state.list.splice(index, 1);
	}
	state.list.unshift(current);

	// console.log(state.list)
	return state.list;
}

export function remove(state, current) {
	// console.log("# remove");
	const index = state.list.findIndex(item => item._id === current._id);
	if (~index) {
		state.list.splice(index, 1);
	}
	return state.list;
}

export function replaceOrPrependAll(state, list) {
	// console.log("# replaceOrAppendAll");
	list.forEach(current => replaceOrPrepend(state, current));
	return state.list;
}

export function replaceAll(state, list) {
	// console.log("# replaceAll");
	state.list.splice(0, state.list.length, ...list);
	return state.list;
}

export function prependAll(state, list) {
	// console.log("# prependAll");
	state.list.unshift(...list);
	return state.list;
}
