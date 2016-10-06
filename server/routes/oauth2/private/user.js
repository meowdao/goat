import {wrapJSON} from "../../wrapper";
import {methodNotAllowed} from "../../utils";


import UserController from "../../../controllers/user/user";

export default function (router) {
	const userController = new UserController();

	router.route("/users/sendVerificationEmail")
		.get((request, response, next) => {
			request.params.sendVerificationEmail = true;
			next();
		}, wrapJSON(::userController.sendVerificationEmail))
		.all(methodNotAllowed);
}
