import configs from "../../../shared/configs/config";

export default class AbstractAPI {
	get config() {
		return configs[process.env.NODE_ENV][this.constructor.name.toLowerCase()];
	}

	get client() {
		throw new Error("getClient should be overridden");
	}
}
