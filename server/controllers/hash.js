"use strict";

import AbstractController from "./abstract/abstract";


export default class HashController extends AbstractController {

	static types = {
		email: "email",
		password: "password"
	};

}
