export function getType(variable) {
	return Object.prototype.toString.call(variable).match(/\s([^\]]+)/)[1];
}