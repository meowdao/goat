"use strict";

import debug from "debug";

export default class DebuggableController {

	displayName = "Debuggable";

	isDebuggable = true;

	constructor(isDebuggable = true) {
		this.displayName = this.constructor.name.slice(0, -10).toLocaleLowerCase();
		this.isDebuggable = isDebuggable;
		if (this.isDebuggable) {
			this.log = debug(`controller:${this.displayName}`);
		} else {
			this.log = () => null;
		}
	}

}
