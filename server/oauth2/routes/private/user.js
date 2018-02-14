import {Router} from "express";
import {wrapJSON} from "../../../shared/utils/wrapper";
import {methodNotAllowed} from "../../../shared/utils/middleware";
import UserController from "../../controllers/user";

const router = Router(); // eslint-disable-line new-cap
const userController = new UserController();

router.route("/users/email")
	.put(wrapJSON(::userController.editEmail))
	.all(methodNotAllowed);

router.route("/users/password")
	.put(wrapJSON(::userController.editPassword))
	.all(methodNotAllowed);

router.route("/sendVerificationEmail")
	.get(wrapJSON(::userController.sendVerificationEmail))
	.all(methodNotAllowed);

export default router;
