"use strict";

import AbstractController from "./abstract/abstract.js";


export default class HashController extends AbstractController {

	static types = {
		email: "email",
		password: "password"
	};

}
