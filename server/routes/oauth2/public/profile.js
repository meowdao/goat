import {wrapJSON} from "../../wrapper";
import {methodNotAllowed} from "../../utils";

import UserController from "../../../controllers/user/user";


export default function (router) {
	const userController = new UserController();

	router.route("/forgot")
		.post(wrapJSON(::userController.forgot))
		.all(methodNotAllowed);

	router.route("/me")
		.get(wrapJSON(::userController.me))
		.all(methodNotAllowed);

	router.route("/email/:email")
		.get(wrapJSON(::userController.checkEmail))
		.all(methodNotAllowed);

	router.route("/verify/:token")
		.get(wrapJSON(::userController.verify))
		.all(methodNotAllowed);

	router.route("/change")
		.post(wrapJSON(::userController.change))
		.all(methodNotAllowed);
}
