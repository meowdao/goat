"use strict";

import debug from "debug";
import util from "util";

export default class DebuggableController {

	static displayName;

	constructor(isDebuggable) {
		this.constructor.displayName = this.constructor.name.slice(0, -10);
		if (isDebuggable) {
			this.log = (...args) =>
				debug(`controller:${this.constructor.displayName}`)(...args.map(arg =>
					util.inspect(arg, {depth: 10, colors: true})
				));
		} else {
			this.log = () => null;
		}
	}

}
