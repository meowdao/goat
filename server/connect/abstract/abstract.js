export default class AbstractAPI {

	displayName = "Debuggable";

	constructor() {
		this.displayName = this.constructor.name.slice(0, -3).toLowerCase();
	}

	get config() {
		return require("../../configs/config").default[process.env.NODE_ENV][this.displayName];
	}

	get client() {
		throw new Error("getClient should be overridden");
	}

}
