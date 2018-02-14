export function readFromString(name, string, delimeter) {
	const parts = string.split(delimeter);
	for (let i = parts.length - 1; i >= 0; i--) {
		const [key, value] = parts[i].split("=");
		if (name === key) {
			return decodeURIComponent(value);
		}
	}
	return "";
}

export function readFromCookies(name, cookie = document.cookie, delimeter = "; ") {
	return readFromString(name, cookie, delimeter);
}

export function readFromQueryString(name, search = document.location.search, delimeter = "&") {
	return readFromString(name, search.slice(1), delimeter);
}
