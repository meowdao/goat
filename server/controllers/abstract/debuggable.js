"use strict";

import debug from "debug";

class DebuggableController {

	displayName = "Debuggable";

	isDebuggable = true;

	constructor(isDebuggable = true) {
		this.displayName = this.constructor.name.slice(0, -10).toLowerCase();
		this.isDebuggable = isDebuggable;
		if (this.isDebuggable) {
			this.log = debug(`controller:${this.displayName}`);
		} else {
			this.log = () => null;
		}
	}

}


export default DebuggableController;
