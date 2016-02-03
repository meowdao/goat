"use strict";

//import passport from "passport";
import {wrapJSON} from "../utils/helper.js";
//import {requiresLogin} from "../utils/middleware.js";
import UserController from "../controllers/user.js";

export default function (app) {
	const userController = new UserController();

	app.get("/admin/users", wrapJSON(::userController.getUsers));
	app.put("/admin/usersupdate/:_id", wrapJSON(::userController.usersUpdate));
}