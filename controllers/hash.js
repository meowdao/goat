"use strict";

import mongoose from "mongoose";

import AbstractController from "../utils/controller.js";
import messager from "../utils/messager.js";


export default class HashController extends AbstractController {

	constructor() {
		super(mongoose.model("Hash"));
	}

}

