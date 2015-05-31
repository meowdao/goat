"use strict";

import {EventEmitter} from "events";
import Dispatcher from "../dispatcher/dispatcher.js";

export default class BaseStore extends EventEmitter {

	constructor() {
		super();
	}

	subscribe(actionSubscribe) {
		this._dispatchToken = Dispatcher.register(actionSubscribe());
	}

	get dispatchToken() {
		return this._dispatchToken;
	}

	emitChange() {
		this.emit("CHANGE");
	}

	addChangeListener(callback) {
		this.on("CHANGE", callback);
	}

	removeChangeListener(callback) {
		this.removeListener("CHANGE", callback);
	}
}
