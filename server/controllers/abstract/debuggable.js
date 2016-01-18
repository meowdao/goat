"use strict";

import debug from "debug";
import util from "util";

class DebuggableController {

	displayName = "Debuggable";

	constructor(isDebuggable) {
		this.displayName = this.constructor.name.slice(0, -10).toLowerCase();
		if (isDebuggable) {
			this.log = (...args) =>
				debug(`controller:${this.displayName}`)(...args.map(arg =>
					util.inspect(arg, {depth: 10, colors: true})));
		} else {
			this.log = () => null;
		}
	}

}


export default DebuggableController;
