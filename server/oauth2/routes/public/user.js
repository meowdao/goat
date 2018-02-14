import {Router} from "express";
import {wrapJSON} from "../../../shared/utils/wrapper";
import {methodNotAllowed, validateParams} from "../../../shared/utils/middleware";
import {reEmail} from "../../../../shared/constants/regexp";

import UserController from "../../controllers/user";


const router = Router(); // eslint-disable-line new-cap
const userController = new UserController();

router.route("/users")
	.post(wrapJSON(::userController.insert))
	.all(methodNotAllowed);

router.route("/users/forgot")
	.post(validateParams([{
		name: "email",
		type: String,
		regexp: reEmail,
		required: true
	}], "body"), wrapJSON(::userController.forgot))
	.all(methodNotAllowed);

router.route("/users/verify")
	.get(wrapJSON(::userController.verifyEmail))
	.all(methodNotAllowed);

router.route("/users/change")
	.put(wrapJSON(::userController.changePassword))
	.all(methodNotAllowed);

router.route("/users/resend")
	.post(wrapJSON(::userController.resendToken))
	.all(methodNotAllowed);

router.route("/sync")
	.get(wrapJSON(::userController.sync))
	.all(methodNotAllowed);

export default router;
