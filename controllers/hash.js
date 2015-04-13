"use strict";

import mongoose from "mongoose";

import AbstractController from "../utils/controller.js";
import messager from "../utils/messager.js";


export default class HashController extends AbstractController {

	constructor() {
		super(mongoose.model("Hash"));
	}

	getByIdAndDate(id) {
		var date = new Date();
		date.setDate(date.getDate() - 1);
		return this.findOne({
			_id: id,
			"date.created": {$gte: date}
		})
			.then(messager.checkModel("expired-key"));
	}
}

