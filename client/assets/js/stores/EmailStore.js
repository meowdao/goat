"use strict";

class EmailStore {

	_data = {};

	setData(data) {
		this._data = data;
	}

	getData() {
		return this._data;
	}

	getUrl(){
		return "http://localhost:3000/";
	}
}

export default new EmailStore();
