export function getObject(path, obj = {}, delimiter = ".") {
	const paths = path.split(delimiter);
	let current = obj;

	for (let i = 0; i < paths.length; ++i) {
		if (current[paths[i]] === void 0) {
			return path;
		} else {
			current = current[paths[i]];
		}
	}
	return current;
}

export function getRandomColor() {
	return `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`;
}

export function getRandomElement(array = []) {
	return array[Math.floor(Math.random() * array.length)];
}

export function getRandomString(length = 64, type = 3) {
	const chars = [
		"0123456789",
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	];
	const result = [];
	for (let i = 0; i < length; i++) {
		result.push(chars[type].charAt(Math.floor(Math.random() * chars[type].length)));
	}
	return result.join("");
}

export function getRandomFloat(min, max, fixed = 0) {
	return (Math.random() * (max - min) + min).toFixed(fixed) * 1;
}

export function toDollars(amount) {
	return `$${(amount ? amount / 100 : 0).toFixed(2)}`;
}

export function toTitleCase(str) {
	return str.split(".")[0].replace(/(^|-)(\w)/g, (all, $1, $2) => $2.toUpperCase());
}

export function getType(variable) {
	return Object.prototype.toString.call(variable); // .match(/\[object (\w+)\]/i)[1]
}

export function isType(variable, type) {
	return getType(variable) === `[object ${type}]`;
}
